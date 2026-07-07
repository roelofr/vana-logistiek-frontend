<script setup lang="ts">
import type { Chat } from "~/types";

const { chat } = defineProps<{ chat: Chat }>();

const isIssue = computed(() => Boolean(chat.subject));
const vendor = computed(() => chat.subject?.vendor);
const location = computed(() => chat.subject?.location);

const participants = computed(() =>
  [...chat.users, ...chat.groups].map((row) => row.name).join(", "),
);
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
      />
    </div>

    <div v-else-if="location" class="flex py-4 gap-2 items-center">
      <UUser
        size="xl"
        name="Locatiegestuurde melding"
        :description="participants"
        :avatar="{ icon: 'i-lucide-map-pin' }"
      />
      <UAvatar
        icon="i-lucide-marker"
        class="flex-none"
        color="secondary"
        text="Location"
      />
      <div class="flex-grow">
        <p><strong>Taak voor een locatie</strong></p>
        <p>Iets met woorden</p>
      </div>
    </div>

    <div v-else class="flex py-4 gap-2 items-center">
      <UAvatar
        icon="i-lucide-marker"
        class="flex-none"
        color="secondary"
        text="Chat"
      />
      <div class="flex-grow">
        <p>
          <strong>{{ chat.title }}</strong>
        </p>
        <p>Iets met woorden</p>
      </div>
    </div>

    <template #right>
      <template v-if="isIssue">
        <UButton color="primary" leading-icon="i-lucide-check"
          >Opgelost</UButton
        >
        <UButton icon="i-lucide-menu" />
      </template>
      <template v-else>
        <UButton color="primary" leading-icon="i-lucide-archive"
          >Archiveren</UButton
        >
      </template>
    </template>
  </UDashboardToolbar>
</template>

<style scoped></style>
