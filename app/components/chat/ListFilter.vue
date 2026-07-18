<script lang="ts" setup>
import type { SelectItem } from "@nuxt/ui";

const { defaultType, defaultSort } = defineProps<{
  defaultType: string;
  defaultSort: string;
}>();
const chatType = defineModel<string>("type");
const chatSort = defineModel<string>("sort");

const typeFilterActive = computed(() => defaultType !== chatType.value);
const sortFilterActive = computed(() => defaultSort !== chatSort.value);
const active = computed(() => typeFilterActive.value || sortFilterActive.value);

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
        <UFormField
          :hint="typeFilterActive ? 'Actief' : undefined"
          label="Filter"
        >
          <USelect
            v-model="chatType"
            :items="chatTypeOptions"
            :ui="{ content: 'min-w-fit' }"
            class="w-full"
            size="sm"
            value-key="value"
          />
        </UFormField>
        <UFormField
          :hint="sortFilterActive ? 'Actief' : undefined"
          label="Sortering"
        >
          <USelect
            v-model="chatSort"
            :items="chatSortOptions"
            :ui="{ content: 'min-w-fit' }"
            class="w-full"
            size="sm"
          />
        </UFormField>
      </div>
    </template>
  </UPopover>
</template>
