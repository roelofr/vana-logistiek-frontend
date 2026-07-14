<script setup lang="ts">
import type { Chat } from "~/types";

const { chat } = defineProps<{ chat: Chat }>();

const vendor = computed(() => chat.subject?.vendor);
const location = computed(() => chat.subject?.location);
const participants = computed(() => getChatParticipants(chat));
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

        <template #description>
          <div class="flex flex-wrap items-center gap-2">
            <VendorNumber :vendor="vendor" />
            <span>{{ participants }}</span>
          </div>
        </template>
      </UUser>
    </div>

    <div
      v-else-if="location"
      class="flex py-4 gap-2 w-full justify-between items-center"
    >
      <UUser
        size="xl"
        :name="`Melding in ${locationToGrid(location)}`"
        :description="participants"
        :avatar="{ icon: 'i-lucide-map-pin', color: 'primary' }"
      />

      <UPopover arrow>
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
