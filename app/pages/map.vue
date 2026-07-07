<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

useHead({ title: "Plattegrond" });
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar title="Plattegrond" icon="i-lucide-map">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <MapView interactive />
    </template>
  </UDashboardPanel>
</template>
