<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const { active } = defineProps<{ active: boolean }>();
const chatType = defineModel<string>("type");
const chatSort = defineModel<string>("sort");

const chatTypeOptions: SelectItem[] = [
  {
    label: "Actief",
    value: "active",
  },
  {
    label: "Afgerond",
    value: "inactive",
  },
  {
    label: "Alle",
    value: "all",
  },
];

const chatSortOptions: SelectItem[] = [
  {
    value: "updated-at",
    label: "Laatst gewijzigd",
    icon: "i-lucide-clock",
  },
  {
    value: "created-at",
    label: "Aangemaakt op",
    icon: "i-lucide-clock-plus",
  },
  {
    value: "vendor-id",
    label: "Standnummer",
    icon: "i-lucide-arrow-down-0-1",
  },
];
</script>

<template>
  <UPopover>
    <UButton
      label="Filter"
      :color="active ? 'primary' : 'neutral'"
      icon="i-lucide-filter"
      size="xs"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
    />

    <template #content>
      <div class="p-4 grid gap-2">
        <UFormField label="Filter">
          <USelect
            v-model="chatType"
            size="sm"
            class="w-full"
            :items="chatTypeOptions"
            :ui="{ content: 'min-w-fit' }"
            value-key="value"
          />
        </UFormField>
        <UFormField label="Sortering">
          <USelect
            v-model="chatSort"
            size="sm"
            class="w-full"
            :items="chatSortOptions"
            :ui="{ content: 'min-w-fit' }"
          />
        </UFormField>
      </div>
    </template>
  </UPopover>
</template>
