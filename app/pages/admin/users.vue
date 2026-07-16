<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import { type Column, getPaginationRowModel } from "@tanstack/table-core";
import type { User } from "~/types";

definePageMeta({
  middleware: ["auth"],
});

useHead({ title: "Gebruikers" });

useGroups();

const filter = ref<string | undefined>("");
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const { hasPermissionTo } = useSession();
const table = useTemplateRef("table");

const { data, status, refresh } = await useLazyFetch<User[]>("/api/users", {
  transform: (data) => expand(data, ["group"]),
});

const columns: TableColumn<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    accessorFn: (row) =>
      String(row.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim(),
  },
  {
    id: "group",
    header: "Groep",
    accessorFn: (row) => row.group?.name,
  },
  {
    id: "roles",
    header: "Rol",
    accessorFn: (row) => row.roles?.join(", "),
  },
];

function getSortingIcon(column: Column<User>): string {
  const isSorted = column.getIsSorted();
  if (isSorted === "asc") return "i-lucide-arrow-up-narrow-wide";
  if (isSorted) return "i-lucide-arrow-down-wide-narrow";

  return "i-lucide-arrow-up-down";
}

interface RoleDefinition {
  label: string;
  value: string;
}

const { data: roleValues } = useFetch<RoleDefinition[]>("/api/roles");

/**.
 * Get the highest role of the user, as ordered by the backend.
 * @param roles
 * @param user
 */
function getHighestRole(roles: RoleDefinition[] | undefined, user: User) {
  if (!roles) return user.roles?.[0];

  for (let i = roles.length - 1; i >= 0; i--) {
    if (user.roles?.includes(roles[i]!.value)) {
      return roles[i]!.label;
    }
  }

  return undefined;
}

const loadingUsers = ref<number[]>([]);

function isLoading(user: User) {
  return loadingUsers.value.includes(user.id);
}

async function applyUserGroup(user: User) {
  loadingUsers.value = [...loadingUsers.value, user.id];

  if (!user.group) return;

  try {
    await $fetch(`/api/users/${user.id}/groups`, {
      dedupe: "defer",
      server: false,
      method: "PATCH",
      body: { groups: [user.group.id] },
    });

    refresh();
  } finally {
    loadingUsers.value = loadingUsers.value.filter((id) => id !== user.id);
  }
}

async function applyRoles(user: User, callback: () => void) {
  loadingUsers.value = [...loadingUsers.value, user.id];
  callback();

  try {
    await $fetch(`/api/users/${user.id}/roles`, {
      method: "PATCH",
      body: user.roles,
    });

    refresh();
  } finally {
    loadingUsers.value = loadingUsers.value.filter((id) => id !== user.id);
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <UInput
      v-model="filter"
      class="max-w-sm"
      icon="i-lucide-search"
      placeholder="Filter op naam..."
    />
  </div>

  <UTable
    ref="table"
    v-model:global-filter="filter"
    v-model:pagination="pagination"
    :pagination-options="{
      getPaginationRowModel: getPaginationRowModel(),
    }"
    :columns="columns"
    :data="data"
    :loading="status === 'pending'"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default',
      separator: 'h-0',
    }"
    class="shrink-0"
  >
    <template #name-header="{ column }">
      <UButton
        color="neutral"
        variant="ghost"
        label="Naam"
        :icon="getSortingIcon(column)"
        class="-mx-2.5"
        @click="column.toggleSorting(column.getIsSorted() === 'asc')"
      />
    </template>

    <template #name-cell="{ row }">
      <UUser :name="row.original.name">
        <template #avatar>
          <UserAvatar :user="row.original" single />
        </template>
      </UUser>
    </template>

    <template #group-cell="{ row }">
      <template v-if="!hasPermissionTo('admin')">
        <div v-if="!row.original.group" class="text-muted">
          Geen groep toegewezen
        </div>
        <div v-else class="flex gap-2 items-center">
          <GroupAvatar size="2xs" :group="row.original.group ?? null" />
          <span>{{ row.original.group.name }}</span>
        </div>
      </template>
      <GroupSelect
        v-else
        v-model="row.original.group"
        placeholder="Geen groep toegewezen"
        :disabled="isLoading(row.original)"
        @change="applyUserGroup(row.original)"
      />
    </template>

    <template #roles-cell="{ row }">
      <UPopover v-if="hasPermissionTo('admin')">
        <UButton
          variant="outline"
          color="neutral"
          trailing-icon="i-lucide-chevron-down"
          class="min-w-40"
          :ui="{ trailingIcon: 'ml-auto' }"
          :disabled="isLoading(row.original)"
        >
          {{ getHighestRole(roleValues, row.original) ?? "Geen rol" }}
        </UButton>

        <template #content="{ close }">
          <div class="p-4 grid grid-cols-1 gap-4">
            <UCheckboxGroup v-model="row.original.roles" :items="roleValues" />
            <UButton
              size="sm"
              color="neutral"
              label="Toepassen"
              @click="applyRoles(row.original, close)"
            />
          </div>
        </template>
      </UPopover>
      <template v-else>{{
        getHighestRole(roleValues, row.original) ?? "Geen rol"
      }}</template>
    </template>
  </UTable>

  <div
    class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto"
  >
    <div class="text-sm text-muted">
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
      van
      {{ table?.tableApi?.getCoreRowModel().rows.length || 0 }} rij(en) in
      filter.
    </div>

    <div class="flex items-center gap-1.5">
      <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
