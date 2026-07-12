<script setup lang="ts">
import type { ChatSystemMessage } from "~/types";
import { GroupAvatar, UserAvatar } from "#components";

const { entry } = defineProps<{ entry: ChatSystemMessage }>();
</script>

<template>
  <p
    class="text-sm text-muted flex items-center gap-2 justify-center flex-wrap"
  >
    <template v-if="entry.messageType == 'created' && entry.user">
      Aangemaakt door
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }}.
    </template>
    <template v-else-if="entry.messageType == 'user-added' && entry.user">
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }} is toegevoegd aan de chat.
    </template>
    <template v-else-if="entry.messageType == 'group-added' && entry.group">
      <GroupAvatar size="xs" :group="entry.group" />
      {{ entry.group.name }} is toegevoegd aan de chat.
    </template>
    <template v-else-if="entry.messageType == 'resolved' && entry.user">
      Melding gemarkeerd als opgelost door
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }}.
    </template>
    <template v-else-if="entry.messageType == 'unresolved' && entry.user">
      Melding gemarkeerd als niet-opgelost door
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }}.
    </template>
    <template v-else-if="entry.messageType == 'closed' && entry.user">
      Chat afgesloten door
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }}.
    </template>
    <template v-else-if="entry.messageType == 'reopen' && entry.user">
      Chat heropend door
      <UserAvatar size="xs" :user="entry.user" />
      {{ entry.user.name }}.
    </template>
    <template v-else>
      {{ entry.message }}
    </template>
  </p>
  <p class="text-xs text-muted text-center">
    <ChatEntryTime :datetime="entry.createdAt" />
  </p>
</template>

<style scoped></style>
