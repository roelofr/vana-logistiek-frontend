<script setup lang="ts">
import type { Vendor } from '~/types'
import type { InputMenuItem } from '@nuxt/ui'
import { expand } from '~/utils'

const { data: apiVendors, status: apiStatus, execute: fetchVendors } = useApi<Vendor[]>('/api/vendors', {
  immediate: false,
})

type InputVendorItem = InputMenuItem & {
  search: string
  district: string
  number: string
}

const toNuxtUiList = (vendor: Vendor): InputVendorItem => ({
  type: 'item',
  label: vendor.name,
  search: `${vendor.number} ${vendor.name}`,
  description: vendor.number,
  district: vendor.district?.name ?? null,
  number: vendor.number,
})

const vendor = defineModel<Vendor>()
const vendors = computed(() => apiVendors.value ? expand(apiVendors.value, ['district']) : [])
const vendorsMapped = computed(() => vendors.value?.map(toNuxtUiList) ?? [])
const vendorIndexed = computed(() => new Map(vendors.value?.map(v => [v.id, v])))

const uiModel = computed({
  get: () => vendor.value ? toNuxtUiList(vendor.value) : undefined,
  set: (value: number | null) => !value ? null : vendorIndexed.value?.get(value) ?? null,
})

function fetchVendorsOnInitialOpen() {
  if (apiStatus.value == 'idle') {
    console.log('Fetching vendors...')
    fetchVendors()
  }
}
</script>

<template>
  <UInputMenu
    v-model="uiModel"
    placeholder="Selecteer standhouder"
    icon="i-lucide-store"
    :filter-fields="['search']"
    :items="vendorsMapped"
    :ui="{ content: 'min-w-fit' }"
    :loading="apiStatus == 'pending'"
    open-on-focus
    virtualize
    size="lg"
    @update:open="fetchVendorsOnInitialOpen"
  >
    <template #trailing="{ modelValue }">
      <span v-if="modelValue" class="text-muted pr-1">{{ modelValue.number }}</span>
      <UIcon name="i-lucide-chevron-down" size="calc(var(--spacing) * 5)" class="text-dimmed" />
    </template>
    <template #item-description="{ item }">
      <div class="flex flex-row items-center gap-2">
        <UBadge variant="outline" size="sm" color="neutral">
          {{ item.number }}
        </UBadge>
        <span class="text-muted text-sm">
          {{ item.district }}
        </span>
      </div>
    </template>
  </UInputMenu>
</template>
