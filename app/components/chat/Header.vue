<script setup lang="ts">
import type { Chat } from "~/types";
import { locationToGrid } from "~/utils/location-util";

const { chat } = defineProps<{ chat: Chat }>();

const isIssue = computed(() => Boolean(chat.subject));
const vendor = computed(() => chat.subject?.vendor);
const location = computed(() => chat.subject?.location);

const participants = computed(() =>
  [...chat.users, ...chat.groups].map((row) => row.name).join(", "),
);

const userAvatars = computed(() => {
  if (!chat.users) return [];
  if (chat.users.length > 2) return chat.users.slice(0, 2);
  return chat.users;
});

const groupAvatars = computed(() => {
  const wantedCount = 2 - userAvatars.value.length;
  if (!chat.groups || wantedCount <= 0) return [];
  if (chat.groups.length > wantedCount)
    return chat.groups.slice(0, wantedCount);
  return chat.groups;
});
</script>

<template>
  <UDashboardToolbar>
    <div v-if="vendor" class="flex py-4 gap-2 items-center">
      <UUser
        size="xl"
        :name="vendor.name"
        :description="vendor.number"
        :ui="{ avatar: `bg-${vendor.colour}-500` }"
        :avatar="{ icon: vendor.icon ?? 'i-lucide-store' }"
      >
        <template #avatar>
          <VendorAvatar :vendor="vendor" size="xl" />
        </template>

        <template #name>
          <NuxtLink :href="`/vendors/${vendor.id}`">{{ vendor.name }}</NuxtLink>
        </template>
      </UUser>
    </div>

    <div v-else-if="location" class="flex py-4 gap-2 items-center">
      <UUser
        size="xl"
        :name="`Melding in ${locationToGrid(location)}`"
        :description="participants"
        :avatar="{ icon: 'i-lucide-map-pin', color: 'primary' }"
      />

      <UPopover>
        <UButton
          label="Toon op kaart"
          color="neutral"
          variant="subtle"
          icon="i-lucide-map-pinned"
        />

        <template #content>
          <div class="w-screen max-w-200 h-200 max-h-[50vh] p-2">
            <MapView :location="location" />
          </div>
        </template>
      </UPopover>
    </div>

    <div v-else class="flex py-4 gap-2 items-center">
      <UUser
        size="xl"
        :name="chat.title"
        :description="participants"
        :avatar="{ icon: 'i-lucide-message-square-text' }"
      >
        <template #avatar>
          <ChatAvatars :chat="chat" />
        </template>
      </UUser>
    </div>
  </UDashboardToolbar>
</template>

<style scoped></style>
