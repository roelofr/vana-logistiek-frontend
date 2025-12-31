<script lang="ts" setup>
import type { Vendor } from '~/types'
import type { InputMenuItem } from '@nuxt/ui'
import { expand } from '~/utils'

const { data: apiVendors, status: apiStatus, execute: fetchVendors } = useApi<Vendor[]>('/api/vendors', {
  immediate: false,
})

type InputVendorItem = InputMenuItem & {
  id: number
  search: string
  district: string
  number: string
}

const toNuxtUiList = (vendor: Vendor): InputVendorItem => ({
  id: vendor.id,
  type: 'item',
  label: vendor.name,
  search: `${vendor.number} ${vendor.name}`,
  description: vendor.number,
  district: vendor.district?.name ?? null,
  number: vendor.number,
})

const vendor = defineModel<Vendor | null>({ required: true })
const vendors = computed(() => apiVendors.value ? expand(apiVendors.value, ['district']) : [])
const vendorsMapped = computed(() => vendors.value?.map(toNuxtUiList) ?? [])
const vendorIndexed = computed(() => new Map(vendors.value?.map(v => [v.id, v])))

const uiVendor = computed<InputVendorItem | undefined>({
  get() {
    return vendor.value ? toNuxtUiList(vendor.value) : undefined
  },
  set(value) {
    if (!value) {
      vendor.value = null
      return
    }

    vendor.value = (vendorIndexed.value!).get(value.id) ?? null
    if (vendor.value == null)
      console.error('Could not find %o in %o', value.id, vendorIndexed.value)
  },
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
    v-model="uiVendor"
    :filter-fields="['search']"
    :items="vendorsMapped"
    :loading="apiStatus == 'pending'"
    :ui="{ content: 'min-w-fit' }"
    icon="i-lucide-store"
    open-on-focus
    placeholder="Selecteer standhouder"
    virtualize
    @update:open="fetchVendorsOnInitialOpen"
  >
    <template #trailing="{ modelValue }">
      <span v-if="modelValue" class="text-muted pr-1">{{ modelValue.number }}</span>
      <UIcon class="text-dimmed" name="i-lucide-chevron-down" size="calc(var(--spacing) * 5)" />
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
