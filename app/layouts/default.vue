<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const menuOpen = ref(false);
const closeMenu = () => {
  menuOpen.value = false;
};

const confetti = useConfetti();

const links = [
  [
    {
      label: "Start",
      icon: "i-lucide-house",
      to: "/",
      onSelect: closeMenu,
    },
    {
      label: "Inbox",
      icon: "i-lucide-inbox",
      to: "/inbox",
      exact: false,
      exactQuery: "partial",
      onSelect: closeMenu,
    },
    {
      label: "Standhouders",
      icon: "i-lucide-store",
      to: "/vendors",
      exact: false,
      exactQuery: "partial",
      onSelect: closeMenu,
    },
    {
      label: "Instellingen",
      to: "/settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "Profiel",
          to: "/settings",
          exact: true,
          onSelect: closeMenu,
        },
        {
          label: "Gebruikers",
          to: "/settings/users",
          onSelect: closeMenu,
        },
      ],
    },
    {
      label: "Systeem",
      to: "/admin",
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "Algemeen",
          to: "/admin",
          exact: true,
          onSelect: closeMenu,
        },
        {
          label: "Wijken",
          to: "/admin/districts",
          onSelect: closeMenu,
        },
        {
          label: "Gebruikers",
          to: "/admin/users",
          onSelect: closeMenu,
        },
        {
          label: "Sessie",
          to: "/janken",
          onSelect: closeMenu,
        },
      ],
    },
  ],
  [
    {
      label: "Feest",
      icon: "i-lucide-party-popper",
      type: "trigger",
      onSelect: () => confetti.dispatch("dino"),
    },
    {
      label: "Noodknop",
      icon: "i-lucide-rainbow",
      type: "trigger",
      onSelect: () => confetti.dispatch("gay"),
    },
    {
      label: "Emotional Support",
      icon: "i-lucide-info",
      to: "https://pornhub.com/",
      target: "_blank",
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Snel naar...",
    items: links.flat(),
  },
]);

const showCreateIssue = ref(false);
const createIssue = () => {
  showCreateIssue.value = true;
};
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="menuOpen"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
      class="bg-elevated/25"
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <Logo v-if="!collapsed" class="h-5 w-auto shrink-0" />
        <UIcon
          v-else
          class="size-5 text-primary mx-auto"
          name="i-simple-icons-nuxtdotjs"
        />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default"
          label="Zoeken..."
        />

        <UButton
          v-if="collapsed"
          icon="i-lucide-plus"
          size="md"
          @click="createIssue()"
        />
        <UButton v-else leading-icon="i-lucide-plus" @click="createIssue()">
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

  <!-- modals -->
  <CreateIssueModal v-model:open="showCreateIssue" />
</template>
