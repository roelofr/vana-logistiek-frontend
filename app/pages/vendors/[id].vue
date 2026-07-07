<script lang="ts" setup>
import { computed } from "vue";
import type { Vendor } from "~/types";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

// Fetches new data every time you switch messages
const { data: vendor } = await useFetch<Vendor>(
  () => `/api/vendors/${route.params.id}`,
);

const vendorTableColumns = ref([
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "title",
    header: "Onderwerp",
  },
  {
    accessorKey: "participants",
    header: "Betrokkenen",
  },
]);

useHead({ title: computed(() => `${vendor.value?.name} - Standhouders`) });
</script>

<template>
  <UDashboardPanel id="vendors">
    <template #header>
      <UDashboardNavbar :title="vendor.name">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <VendorAvatar :vendor="vendor" size="lg" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-2 gap-2">
        <UPageCard title="Issues">
          <UTable :data="[]" :columns="vendorTableColumns">
            <template #empty>
              <UEmpty class="m-4" title="Geen meldingen bekend" />
            </template>
          </UTable>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
