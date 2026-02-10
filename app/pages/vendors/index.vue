<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Vendor } from '~/types'
import { computed } from 'vue'
import { VendorAvatar } from '#components'

const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')

const filter = ref('')
const columnFilters = ref([
  {
    id: 'name',
    value: '',
  }, {
    id: 'number',
    value: '',
  },
])
const columnVisibility = ref()
const rowSelection = ref({ 1: true })

const { data: apiData, status } = await useApi<Vendor[]>('/api/vendors', {
  lazy: true,
})

const data = computed(() => expand(apiData.value, ['district']))

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const columns: TableColumn<Vendor>[] = [
  {
    id: 'name',
    header: 'Naam',
    accessorFn: row => `${row.name}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Naam',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(VendorAvatar, { vendor: row.original, size: 'lg' }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        ]),
      ])
    },
  },
  {
    accessorKey: 'number',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Standnummer',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'district',
    header: 'Wijk',
    cell: ({ row }) => row.original.district?.name,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(UButton, {
          trailingIcon: 'i-lucide-chevron-right',
          color: 'neutral',
          variant: 'ghost',
          class: 'ml-auto',
          to: `/vendors/${row.original.id}`,
        }, 'Bekijken'),
      )
    },
  },
]
</script>

<template>
  <UDashboardPanel id="vendors">
    <template #header>
      <UDashboardNavbar title="Standhouders">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CustomersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="filter"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter op naam of nummer..."
        />
      </div>

      <UTable
        ref="table"
        v-model="filter"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:pagination="pagination"
        v-model:row-selection="rowSelection"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0',
        }"
        class="shrink-0"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
