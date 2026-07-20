<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";
import type { Group, Vendor } from "~/types";

type ExtendedMenuItem = SelectMenuItem & {
  value: string;
  vendor?: Vendor;
  group?: Group;
};

const model = defineModel<string>();
const {
  label,
  items,
  defaultValue,
  search = false,
} = defineProps<{
  label: string;
  items: ExtendedMenuItem[] | ExtendedMenuItem[][];
  defaultValue: string;
  search?: boolean;
}>();

const isActive = computed(() => model.value !== defaultValue);
</script>

<template>
  <UFormField :hint="isActive ? 'Actief' : undefined" :label="label">
    <USelectMenu
      v-model="model"
      :items="items"
      :ui="{ content: 'min-w-fit' }"
      :search-input="search"
      class="w-full"
      size="sm"
      value-key="value"
    >
      <template #item-leading="{ item }">
        <template v-if="item.vendor">
          <VendorAvatar :vendor="item.vendor" size="xs" />
        </template>
        <template v-if="item.group">
          <GroupAvatar :group="item.group" size="xs" />
        </template>
      </template>
    </USelectMenu>
  </UFormField>
</template>
