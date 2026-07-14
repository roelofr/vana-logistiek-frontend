<script setup lang="ts">
import type { Chat, ChatEntry } from "~/types";
import { groupChatMessages } from "~/utils/message-converter";
import { unpackDatesOfObject } from "~/utils/date-util";
import { expand } from "~/utils/data-util";
import type { UChatMessages } from "#components";

const { chat } = defineProps<{ chat: Chat }>();
const emit = defineEmits<{ systemMessage: [ChatEntry] }>();

const {
  data: messages,
  status,
  refresh,
} = useLazyFetch<ChatEntry[]>(`/api/chats/by-id/${chat.id}/entries`, {
  transform: (data) => expand(data as ChatEntry[], ["chat", "group", "user"]),
});

const additionalMessages = ref<ChatEntry[]>([]);

watch(
  () => messages,
  () => (additionalMessages.value = []),
);

const {
  data: streamData,
  status: streamStatus,
  open: streamOpen,
  close: streamClose,
} = useEventSource(() => `/api/chats/stream/${chat.id}`, undefined, {
  immediate: false,
  serializer: {
    read: (rawData) => JSON.parse(rawData!) as ChatEntry,
  },
});

const isStreaming = ref(false);
const chatStatus = computed(() =>
  isStreaming.value ? "streaming" : isLoading.value ? "submitted" : "ready",
);

const toast = useToast();
const reconnectToast = ref<string | number | undefined>();
watch(streamStatus, (status, oldStatus) => {
  if (status === "OPEN" && reconnectToast.value) {
    toast.remove(reconnectToast.value);
    reconnectToast.value = undefined;
  }

  if (status === "CLOSED" && (oldStatus === "OPEN" || reconnectToast.value)) {
    if (reconnectToast.value) toast.remove(reconnectToast.value);

    reconnectToast.value = toast.add({
      color: "error",
      duration: 0,
      icon: "i-lucide-unplug",
      title: "Live-chat gepauzeerd",
      description: "De verbinding met de live-chat is gepauzeerd.",
      actions: [
        {
          label: "Opnieuw verbinden",
          onClick: streamOpen,
        },
      ],
    }).id;
  }

  if (
    status === "CONNECTING" &&
    oldStatus === "CLOSED" &&
    reconnectToast.value
  ) {
    toast.update(reconnectToast.value, {
      color: "primary",
      duration: 0,
      icon: "i-lucide-loader-circle",
      title: "Verbinding opnieuw verbinden",
      description: undefined,
      actions: [],
      ui: { icon: "animate-spin" },
    });
  }
});

effect(() => streamOpen());

onUnmounted(() => {
  streamClose();
  if (reconnectToast.value) toast.remove(reconnectToast.value);
});

watch(streamData, (newData) => {
  if (!newData) return;

  if (newData.type === "system") emit("systemMessage", newData);

  additionalMessages.value = [...additionalMessages.value, { ...newData }];
  isStreaming.value = true;
});

const isLoading = computed(() => ["pending", "idle"].includes(status.value));

const chatMessages = computed(() => {
  const messagesValue = expand(messages.value, ["user", "group"]) ?? [];
  const additionalValue = Array.from(additionalMessages.value);

  const mappedAdditions = new Map(additionalValue.map((m) => [m.id, m]));

  const joinedMessages = messagesValue
    .filter((message) => !mappedAdditions.has(message.id))
    .concat(Array.from(mappedAdditions.values()))
    .map((message) => unpackDatesOfObject(message, ["createdAt", "updatedAt"]))
    .sort(
      (ma: ChatEntry, mb: ChatEntry) =>
        ma.createdAt.getTime() - mb.createdAt.getTime(),
    );

  if (joinedMessages.length == 0) return [];

  return groupChatMessages(joinedMessages);
});

watch(chatMessages, () => {
  isStreaming.value = false;
});

defineExpose({ refresh });
</script>

<template>
  <UChatMessages
    :status="chatStatus"
    should-auto-scroll
    should-scroll-to-bottom
  >
    <ClientOnly>
      <ChatMessageLoading v-if="isLoading && !chatMessages" />
      <template v-else>
        <ChatMessageGroup
          v-for="group of chatMessages"
          :key="group.id"
          :group="group"
        />
      </template>

      <template #fallback>
        <ChatMessageLoading />
      </template>
    </ClientOnly>
  </UChatMessages>

  <DevOnly>
    <details>
      <summary>Raw response</summary>
      <pre><code>{{ JSON.stringify(messages, undefined, 2)}}</code></pre>
    </details>
    <details>
      <summary>Mapped response</summary>
      <pre><code>{{ JSON.stringify(chatMessages, undefined, 2)}}</code></pre>
    </details>
    <details>
      <summary>Parameters</summary>
      <pre><code>{{ JSON.stringify({
        status,
        streamData,
        streamStatus,
      }, undefined, 2)}}</code></pre>
    </details>
  </DevOnly>
</template>

<style scoped></style>
