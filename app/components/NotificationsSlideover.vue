<script lang="ts" setup>
import { formatTimeAgo } from "@vueuse/core";
import type { AvatarProps } from "#ui/components/Avatar.vue";

interface Notification {
  id: number;
  date: string;
  body: string;
  unread: boolean;
  sender: {
    id: number;
    name: string;
    avatar: AvatarProps;
  };
}

const { isNotificationsSlideoverOpen } = useDashboard();

const { data: notifications } =
  await useFetch<Notification[]>("/api/notifications");
</script>

<template>
  <USlideover v-model:open="isNotificationsSlideoverOpen" title="Notifications">
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/chats/${notification.id}`"
        class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
      >
        <UChip :show="!!notification.unread" color="error" inset>
          <UAvatar
            :alt="notification.sender.name"
            size="md"
            v-bind="notification.sender.avatar"
          />
        </UChip>

        <div class="text-sm flex-1">
          <p class="flex items-center justify-between">
            <span class="text-highlighted font-medium">{{
              notification.sender.name
            }}</span>

            <time
              :datetime="notification.date"
              class="text-muted text-xs"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>
