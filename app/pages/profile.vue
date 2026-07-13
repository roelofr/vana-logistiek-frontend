<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
});

const links = [
  [
    {
      label: "Profiel",
      icon: "i-lucide-user",
      to: "/profile",
      exact: true,
    },
  ],
] satisfies NavigationMenuItem[][];
</script>

<template>
  <UDashboardPanel id="profile" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Profiel">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="links.length > 1">
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div
        class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
      >
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
