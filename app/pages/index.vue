<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
  middleware: ['auth'],
})

const { user, session } = useAuth()

const items = [
  [
    {
      label: 'Nieuwe melding',
      icon: 'i-lucide-send',
      to: '/threads/create',
    },
  ],
] satisfies DropdownMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton class="rounded-full" icon="i-lucide-plus" size="md" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UEmpty
        description="Dit blok is nog leeg, we bedenken er vast wel iets voor."
        title="Nope, nog niks"
      >
        <template #leading>
          <UIcon :size="64" name="i-lucide-swords" />
        </template>
      </UEmpty>

      <div class="grid gap-8 grid-cols-2">
        <UCard title="User">
          <pre><code>{{ JSON.stringify(user, undefined, 4) }}</code></pre>
        </UCard>
        <UCard title="Session">
          <pre><code>{{ JSON.stringify(session, undefined, 4) }}</code></pre>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
