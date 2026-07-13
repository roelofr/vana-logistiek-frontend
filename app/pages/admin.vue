<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
});

const links = [
  [
    {
      label: "Algemeen",
      icon: "i-lucide-cog",
      to: "/admin/",
      exact: true,
    },
    {
      label: "Wijken",
      icon: "i-lucide-user",
      to: "/admin/districts",
    },
    {
      label: "Gebruikers",
      icon: "i-lucide-users",
      to: "/admin/users",
    },
  ],
] satisfies NavigationMenuItem[][];
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Administratie">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div
        class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-7xl mx-auto"
      >
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
