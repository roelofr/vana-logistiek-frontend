<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)
const close = () => {
  open.value = false
}

const links = [
  [
    {
      label: 'Start',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: close
    },
    {
      label: 'Tickets',
      icon: 'i-lucide-inbox',
      to: '/tickets',
      badge: '4',
      onSelect: close
    },
    {
      label: 'Standhouders',
      icon: 'i-lucide-store',
      to: '/vendors',
      onSelect: close
    },
    {
      label: 'Instellingen',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: true,
      type: 'trigger',
      children: [
        {
          label: 'Profiel',
          to: '/settings',
          exact: true,
          onSelect: close
        },
        {
          label: 'Gebruikers',
          to: '/settings/users',
          onSelect: close
        }
      ]
    }
  ],
  [
    {
      label: 'Emotional Support',
      icon: 'i-lucide-info',
      to: 'https://pornhub.com/',
      target: '_blank'
    }
  ]
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'links',
    label: 'Snel naar...',
    items: links.flat()
  }
])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <Logo v-if="!collapsed" class="h-5 w-auto shrink-0" />
        <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton label="Zoeken..." :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      placeholder="Typ een commando of zoekopdracht..."
      :groups="groups"
    />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
