<script lang="ts" setup>
import type { Vendor } from "~/types";
import type { InputMenuItem } from "@nuxt/ui";
import type { UInputMenu } from "#components";
import { expand } from "#imports";

type InputVendorItem = InputMenuItem & {
  vendor: Vendor;
  search: string;
  number: string;
  district: string;
};

const toNuxtUiList = (vendor: Vendor): InputVendorItem => ({
  vendor: vendor,
  type: "item",
  label: vendor.name,
  search: `${vendor.number} ${vendor.name}`,
  description: vendor.number,
  number: vendor.number,
  district: vendor.district?.name ?? "",
});

const vendor = defineModel<Vendor | null | undefined>({ required: true });

const { data: apiVendors, pending: apiPending } =
  useFetch<Vendor[]>("/api/vendors");

const vendors = computed(() =>
  apiVendors.value ? expand(apiVendors.value, ["district"]) : [],
);
const vendorsMapped = computed(() => vendors.value?.map(toNuxtUiList) ?? []);

const uiVendor = computed<Vendor | undefined>({
  get: () => vendor.value ?? undefined,
  set: (value) => (vendor.value = value ?? null),
});

watch(
  () => vendorsMapped.value,
  (newValue, oldValue) => {
    if (!oldValue?.length && newValue?.length && uiVendor.value)
      setTimeout(() => (uiVendor.value = { ...uiVendor.value! }), 150);
  },
);
</script>

<template>
  <UInputMenu
    v-model="uiVendor"
    :filter-fields="['search']"
    :items="vendorsMapped"
    :loading="apiPending"
    :ui="{ content: 'min-w-fit' }"
    value-key="vendor"
    icon="i-lucide-store"
    open-on-focus
    placeholder="Selecteer standhouder"
    virtualize
  >
    <template #trailing="{ modelValue }">
      <span v-if="modelValue" class="text-muted pr-1">{{
        modelValue?.number
      }}</span>
      <UIcon
        class="text-dimmed"
        name="i-lucide-chevron-down"
        size="calc(var(--spacing) * 5)"
      />
    </template>
    <template #item-description="{ item }">
      <div class="flex flex-row items-center gap-2">
        <UBadge color="neutral" size="sm" variant="outline">
          {{ item.number }}
        </UBadge>
        <span class="text-muted text-sm">
          {{ item.district }}
        </span>
      </div>
    </template>
  </UInputMenu>
</template>
