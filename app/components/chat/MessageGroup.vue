<script setup lang="ts">
import { computed, h } from "vue";
import type { ChatEntry, ChatEntryGroup } from "~/types";
import {
  ChatEntryFile,
  ChatEntryInvalid,
  ChatEntryLocation,
  ChatEntryMessage,
  ChatEntrySystemMessage,
} from "#components";

const { group } = defineProps<{ group: ChatEntryGroup }>();

const isMe = computed(() => group.isMe);
const avatarProps = computed(() => ({
  user: group.user!,
  group: group.group ?? undefined,
}));

const lastEntry = computed(() => group.entries.at(-1)!);

function ChatEntry({ entry }: { entry: ChatEntry }) {
  switch (entry.type) {
    case "message":
      return h(ChatEntryMessage, { entry });
    case "system":
      return h(ChatEntrySystemMessage, { entry });
    case "file":
      return h(ChatEntryFile, { entry });
    case "location":
      return h(ChatEntryLocation, { entry });
    default:
      return h(ChatEntryInvalid);
  }
}
</script>

<template>
  <template v-if="group.role == 'system'">
    <ChatEntry v-for="entry of group.entries" :key="entry.id" :entry="entry" />
  </template>
  <div
    v-else
    class="flex gap-2"
    :class="isMe ? 'flex-row-reverse' : 'flex-row'"
  >
    <UserAvatar v-bind="avatarProps" class="flex-none" />
    <div
      class="flex flex-col gap-1"
      :class="isMe ? 'items-end' : 'items-start'"
    >
      <ChatEntry
        v-for="entry of group.entries"
        :key="entry.id"
        :entry="entry"
      />

      <ChatEntryTime :datetime="lastEntry.createdAt" class="text-xs mb-2" />
    </div>
  </div>
</template>

<style scoped></style>
