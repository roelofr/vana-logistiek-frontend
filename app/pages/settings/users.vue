<script lang="ts" setup>
import type {User} from "~/types";

const {data: members} = await useFetch<User[]>("/api/users", {
  default: () => [],
});

const query = ref("");

const filteredUsers = computed(() => {
  return members.value.filter((member) => {
    return (
      member.name.search(new RegExp(query.value, "i")) !== -1
    );
  });
});
</script>

<template>
  <div>
    <UPageCard
      class="mb-4"
      description="Nieuwe gebruikers kunnen via Troela Authenticatie worden uitgenodigd."
      orientation="horizontal"
      title="Gebruikers"
      variant="naked"
    >
      <UButton
        class="w-fit lg:ms-auto"
        color="neutral"
        label="Uitnodigen"
        trailing-icon="i-lucide-external-link"
        href="https://login.troela.fun/settings/admin/users"
        target="_blank"/>
    </UPageCard>

    <UPageCard
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default',
      }"
      variant="subtle"
    >
      <template #header>
        <UInput
          v-model="query"
          autofocus
          class="w-full"
          icon="i-lucide-search"
          placeholder="Zoek naar gebruikers"
        />
      </template>

      <SettingsUserList :users="filteredUsers"/>
    </UPageCard>
  </div>
</template>
