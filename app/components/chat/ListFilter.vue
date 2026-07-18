<script lang="ts" setup>
import type { SelectItem } from "@nuxt/ui";

const { defaultType, defaultSort } = defineProps<{
  defaultType: string;
  defaultSort: string;
}>();
const chatType = defineModel<string>("type");
const chatSort = defineModel<string>("sort");

const active = computed(
  () => defaultType !== chatType.value || defaultSort !== chatSort.value,
);

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
      :color="active ? 'primary' : 'neutral'"
      :content="{ side: 'bottom', align: 'right' }"
      arrow
      icon="i-lucide-filter"
      label="Filter"
      size="xs"
      trailing-icon="i-lucide-chevron-down"
      variant="subtle"
    />

    <template #content>
      <div class="p-4 grid gap-2">
        <ChatListFilterField
          label="Filter"
          v-model="chatType"
          :default-value="defaultType"
          :items="chatTypeOptions"
        />

        <ChatListFilterField
          label="Sortering"
          v-model="chatSort"
          :default-value="defaultSort"
          :items="chatSortOptions"
        />
      </div>
    </template>
  </UPopover>
</template>
