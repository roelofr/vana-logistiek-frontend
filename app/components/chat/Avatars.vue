<script setup lang="ts">
import type { Chat } from "~/types";

const { chat, count = 2 } = defineProps<{
  chat: Pick<Chat, "users" | "groups">;
  count?: number;
}>();

const chatUserAvatars = computed(() => {
  if (!chat.users) return [];
  if (chat.users.length > count) return chat.users.slice(0, count);
  return chat.users;
});

const chatGroupAvatars = computed(() => {
  const wantedGroupAvatars = count - chatUserAvatars.value.length;
  if (!chat.groups || !wantedGroupAvatars) return [];
  if (chat.groups.length > wantedGroupAvatars)
    return chat.groups.slice(0, wantedGroupAvatars);
  return chat.groups;
});
</script>

<template>
  <UAvatarGroup>
    <UserAvatar
      v-for="user in chatUserAvatars"
      :key="user.id"
      :user="user"
      single
    />
    <GroupAvatar
      v-for="group in chatGroupAvatars"
      :key="group.id"
      :group="group"
    />
  </UAvatarGroup>
</template>
