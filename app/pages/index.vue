<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items = [[{
  label: 'Nieuwe melding',
  icon: 'i-lucide-send',
  to: '/threads/create',
}]] satisfies DropdownMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UEmpty
        title="Nope, nog niks"
        description="Dit blok is nog leeg, we bedenken er vast wel iets voor."
      >
        <template #leading>
          <UIcon name="i-lucide-swords" :size="64" />
        </template>
      </UEmpty>
    </template>
  </UDashboardPanel>
</template>
