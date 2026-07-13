<script lang="ts" setup>
import { computed } from "vue";
import type { Issue, Vendor } from "~/types";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

// Fetches new data every time you switch messages
const { data: vendor } = await useFetch<Vendor>(
  () => `/api/vendors/${route.params.id}`,
);

const showAll = ref(false);
const { data: vendorIssues, status: vendorIssueStatus } = useLazyFetch<Issue[]>(
  () => `/api/vendors/${route.params.id}/issues`,
  { query: computed(() => ({ all: showAll.value })) },
);

const vendorTableColumns = ref<TableColumn<Issue>[]>([
  {
    id: "id",
    accessorKey: "id",
    header: "#",
  },
  {
    id: "subject",
    accessorFn: (row) => row.chat.title,
    header: "Onderwerp",
  },
  {
    id: "participants",
    header: "Betrokkenen",
    accessorFn: (row) =>
      [...row.chat.users, ...row.chat.groups].map((p) => p.name).join(", "),
  },
]);

useHead({ title: computed(() => `${vendor.value?.name} - Standhouders`) });
</script>

<template>
  <UDashboardPanel id="vendors">
    <template #header>
      <UDashboardNavbar :title="vendor?.name ?? 'Standhouder'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template v-if="vendor">
          <div class="flex items-center gap-4 py-4">
            <VendorAvatar :vendor="vendor" size="lg" />
            <div class="flex flex-col gap-2 items-start">
              <strong>{{ vendor.name }}</strong>
              <VendorNumber :vendor="vendor" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-4 py-4">
            <USkeleton class="h-10 w-10 rounded-full" />
            <div class="flex flex-col gap-2">
              <USkeleton class="w-30 h-4" />
              <USkeleton class="w-12 h-3" />
            </div>
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <UCard>
          <template #header>
            <div class="flex w-full justify-between">
              <h2>Issues</h2>
              <USwitch v-model="showAll" label="Toon van iedereen" />
            </div>
          </template>

          <UTable
            :data="vendorIssues"
            :loading="vendorIssueStatus === 'pending'"
            :columns="vendorTableColumns"
          >
            <template #subject-cell="{ row }">
              <div class="flex items-center gap-4">
                <NuxtLink :to="`/chats/${row.original.chat.id}`">
                  {{ row.original.chat.title }}
                </NuxtLink>

                <UBadge
                  v-if="row.original.resolvedAt"
                  variant="outline"
                  size="xs"
                  color="success"
                  icon="i-lucide-check"
                  aria-label="Opgelost"
                />
              </div>
            </template>

            <template #participants-cell="{ row }">
              <UAvatarGroup>
                <UserAvatar
                  v-for="user of row.original.chat.users ?? []"
                  :key="`chat-${row.id}-user-${user.id}`"
                  :user="user"
                  single
                />
                <GroupAvatar
                  v-for="group of row.original.chat.groups ?? []"
                  :key="`chat-${row.id}-group-${group.id}`"
                  :group="group"
                />
              </UAvatarGroup>
            </template>

            <template #empty>
              <UEmpty
                class="m-4"
                title="Geen meldingen bekend"
                :description="
                  showAll
                    ? 'Er zijn nog geen meldingen gedaan voor deze standhouder.'
                    : 'Je hebt nog geen meldingen gedaan voor deze standhouder.'
                "
                icon="i-lucide-inbox"
              />
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
