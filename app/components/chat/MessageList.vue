<script setup lang="ts">
import type { Chat, ChatEntry } from "~/types";
import { groupChatMessages } from "~/utils/message-converter";

const { chat } = defineProps<{ chat: Chat }>();

const {
  data: messages,
  status,
  refresh,
} = useLazyFetch<ChatEntry[]>(`/api/chats/by-id/${chat.id}/entries`);

const isLoading = computed(() => ["pending", "idle"].includes(status.value));

const chatMessages = computed(() => {
  const messagesValue = expand(messages.value, ["user", "group"]);

  if (!messagesValue) return [];

  return groupChatMessages(messagesValue);
});

defineExpose({ refresh });
</script>

<template>
  <UChatMessages>
    <ClientOnly>
      <ChatMessageLoading v-if="isLoading" />
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
  </DevOnly>
</template>

<style scoped></style>
