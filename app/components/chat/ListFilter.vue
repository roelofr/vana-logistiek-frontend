<script lang="ts" setup>
import type { SelectMenuItem } from "@nuxt/ui";
import type { Group, Vendor } from "~/types";
import ListFilterField from "~/components/chat/ListFilterField.vue";

const {
  defaultType,
  defaultSort,
  availableGroups = [],
  availableVendors = [],
} = defineProps<{
  defaultType: string;
  defaultSort: string;
  availableGroups?: (Pick<Group, "id" | "name"> & Partial<Group>)[];
  availableVendors?: (Pick<Vendor, "id" | "name"> & Partial<Vendor>)[];
}>();

const chatType = defineModel<string>("type");
const chatSort = defineModel<string>("sort");

const active = computed(
  () => defaultType !== chatType.value || defaultSort !== chatSort.value,
);

const defaultChatTypeOptions: SelectMenuItem[] = [
  {
    value: "active",
    icon: "i-lucide-mail",
    label: "Actief",
    description: "Toon alleen active meldingen.",
  },
  {
    value: "inactive",
    icon: "i-lucide-mail-open",
    label: "Afgerond",
    description: "Toon alleen afgeronde meldingen.",
  },
  {
    value: "all",
    icon: "i-lucide-text-align-justify",
    label: "Alle",
    description: "Toon alle meldingen, ongeacht status",
  },
];

const chatTypeOptions = computed(() => [
  defaultChatTypeOptions,
  availableGroups.map(
    (group) =>
      ({
        group,
        value: `group:${group.id}`,
        label: `${group.name}`,
        description: `Toon meldingen waaraan ${group.name} deelneemt`,
      }) as SelectMenuItem,
  ),

  availableVendors.map(
    (vendor) =>
      ({
        vendor,
        value: `vendor:${vendor.id}`,
        label: `${vendor.name}`,
        description: `Toon meldingen waaraan ${vendor.name} deelneemt`,
      }) as SelectMenuItem,
  ),
]);

const chatSortOptions: SelectMenuItem[] = [
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
        <ListFilterField
          v-model="chatType"
          label="Filter"
          :default-value="defaultType"
          :items="chatTypeOptions"
          search
        />

        <ListFilterField
          v-model="chatSort"
          label="Sortering"
          :default-value="defaultSort"
          :items="chatSortOptions"
        />
      </div>
    </template>
  </UPopover>
</template>
