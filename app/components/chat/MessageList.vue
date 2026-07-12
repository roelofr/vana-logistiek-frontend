<script setup lang="ts">
import type { Chat, ChatEntry } from "~/types";
import { groupChatMessages } from "~/utils/message-converter";

const { chat } = defineProps<{ chat: Chat }>();

const skels = ["l", "r", "c", "r", "r", "l", "c", "r"];

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
  <div v-if="isLoading">
    <div v-for="(side, index) in skels" :key="index" class="w-full mb-4">
      <div v-if="side == 'r'" class="flex justify-end gap-2">
        <USkeleton class="h-12 w-75" />
        <USkeleton class="size-8 rounded-full" />
      </div>
      <div v-else-if="side == 'l'" class="flex gap-2">
        <USkeleton class="size-8 rounded-full" />
        <USkeleton class="h-12 w-75" />
      </div>
      <USkeleton v-else class="h-6 w-80 mx-auto" />
    </div>
  </div>
  <UChatMessages v-else>
    <ChatMessageGroup
      v-for="group of chatMessages"
      :key="group.id"
      :group="group"
    />
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
