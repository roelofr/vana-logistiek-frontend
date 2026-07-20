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

const isOpen = ref(false);
const isActive = computed(() =>
  Boolean(defaultType !== chatType.value || defaultSort !== chatSort.value),
);

function reset() {
  chatType.value = defaultType;
  chatSort.value = defaultSort;

  close();
}

function close() {
  isOpen.value = false;
}

type SelectMenuItemWithValue = SelectMenuItem & { value: string };

const defaultChatTypeOptions: SelectMenuItemWithValue[] = [
  {
    value: "active",
    icon: "i-lucide-message-square-heart",
    label: "Actief",
    description: "Toon alleen active meldingen.",
  },
  {
    value: "inactive",
    icon: "i-lucide-message-square-check",
    label: "Afgerond",
    description: "Toon alleen afgeronde meldingen.",
  },
  {
    value: "unread",
    icon: "i-lucide-message-square-dot",
    label: "Ongelezen",
    description: "Toon alleen meldingen met ongelezen berichten.",
  },
  {
    value: "all",
    icon: "i-lucide-messages-square",
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
      }) as SelectMenuItemWithValue,
  ),

  availableVendors.map(
    (vendor) =>
      ({
        vendor,
        value: `vendor:${vendor.id}`,
        label: `${vendor.name}`,
        description: `Toon meldingen waaraan ${vendor.name} deelneemt`,
      }) as SelectMenuItemWithValue,
  ),
]);

const chatSortOptions: SelectMenuItemWithValue[] = [
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
  <UPopover v-model:open="isOpen">
    <UButton
      :color="isActive ? 'primary' : 'neutral'"
      :content="{ side: 'bottom', align: 'right' }"
      arrow
      icon="i-lucide-filter"
      label="Filter"
      size="xs"
      trailing-icon="i-lucide-chevron-down"
      variant="subtle"
    />

    <template #content>
      <div class="p-4 grid gap-2 max-w-72">
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

        <p class="text-muted flex items-center">
          <UIcon class="mr-2 text-base" name="i-lucide-info" />
          <span class="text-xs text-left">
            Instellingen worden gesynchroniseerd.
          </span>
        </p>

        <div class="flex justify-end gap-2">
          <UButton size="xs" variant="soft" color="error" @click="reset()"
            >Reset</UButton
          >
          <UButton size="xs" @click="close()">Opslaan</UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
