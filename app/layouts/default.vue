<script lang="ts" setup>
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
      onSelect: close,
    },
    {
      label: 'Meldingen',
      icon: 'i-lucide-inbox',
      to: '/threads',
      // badge: '4',
      onSelect: close,
    },
    {
      label: 'Standhouders',
      icon: 'i-lucide-store',
      to: '/vendors',
      onSelect: close,
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
          onSelect: close,
        },
        {
          label: 'Gebruikers',
          to: '/settings/users',
          onSelect: close,
        },
      ],
    },
  ],
  [
    {
      label: 'Emotional Support',
      icon: 'i-lucide-info',
      to: 'https://pornhub.com/',
      target: '_blank',
    },
  ],
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'links',
    label: 'Snel naar...',
    items: links.flat(),
  },
])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
      class="bg-elevated/25"
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <Logo v-if="!collapsed" class="h-5 w-auto shrink-0" />
        <UIcon v-else class="size-5 text-primary mx-auto" name="i-simple-icons-nuxtdotjs" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" label="Zoeken..." />

        <UButton href="/threads/create">
          Nieuwe melding
        </UButton>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          popover
          tooltip
        />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          class="mt-auto"
          orientation="vertical"
          tooltip
        />

        <DevOnly>
          <SetAccessToken />
        </DevOnly>
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      :groups="groups"
      placeholder="Typ een commando of zoekopdracht..."
    />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
