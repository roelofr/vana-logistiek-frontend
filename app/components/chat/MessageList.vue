<script lang="ts" setup>
import type { Chat, ChatEntry, ChatEntryGroup } from "~/types";
import { groupChatMessages } from "~/utils/message-converter";
import { unpackDatesOfObject } from "~/utils/date-util";
import { expand } from "~/utils/data-util";

const { chat } = defineProps<{ chat: Chat }>();
const emit = defineEmits<{ systemMessage: [ChatEntry] }>();
const scrollArea = useTemplateRef("scrollArea");

const {
  data: messages,
  status,
  refresh,
} = useLazyFetch<ChatEntry[]>(`/api/chats/by-id/${chat.id}/entries`, {
  transform: (data) => expand(data as ChatEntry[], ["chat", "group", "user"]),
});

const additionalMessages = ref<ChatEntry[]>([]);

watch(messages, () => (additionalMessages.value = []));

watch([messages, additionalMessages], () => {
  const messageCount = messages.value?.length ?? 0;
  const additionalCount = additionalMessages.value?.length ?? 0;
  const totalMessageCount = messageCount + additionalCount;
  if (totalMessageCount == 0) return;

  requestAnimationFrame(() => {
    scrollArea.value?.virtualizer?.scrollToIndex(totalMessageCount - 1, {
      align: "end",
      behavior: "smooth",
    });
  });
});

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
});

const isLoading = computed(() => ["pending", "idle"].includes(status.value));
const finalMessageId = ref<number | null>(null);

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

watch(chatMessages, (messages) => {
  const lastMessageId = messages?.at(-1)?.entries.at(-1)?.id;
  if (lastMessageId) finalMessageId.value = lastMessageId;
});

watch(finalMessageId, (newValue) => {
  $fetch(`/api/chats/by-id/${chat.id}/read`, {
    method: "POST",
    body: { entryId: newValue },
  });
});

defineExpose({ refresh });

const itemAsGroup = (group: unknown): ChatEntryGroup => group as ChatEntryGroup;
</script>

<template>
  <ClientOnly>
    <ChatMessageLoading v-if="isLoading && !chatMessages" />
    <template v-else>
      <UScrollArea
        ref="scrollArea"
        v-slot="{ item }"
        :items="chatMessages"
        class="w-full h-full"
        virtualize
      >
        <ChatMessageGroup :group="itemAsGroup(item)" />
      </UScrollArea>
    </template>

    <template #fallback>
      <ChatMessageLoading />
    </template>
  </ClientOnly>

  <DevOnly>
    <details>
      <summary>Raw response</summary>
      <pre><code>{{ JSON.stringify(messages, undefined, 2) }}</code></pre>
    </details>
    <details>
      <summary>Mapped response</summary>
      <pre><code>{{ JSON.stringify(chatMessages, undefined, 2) }}</code></pre>
    </details>
    <details>
      <summary>Parameters</summary>
      <pre><code>{{
          JSON.stringify({
            status,
            streamData,
            streamStatus,
          }, undefined, 2)
        }}</code></pre>
    </details>
  </DevOnly>
</template>

<style scoped></style>
