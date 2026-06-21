<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  collapsed?: boolean;
}>();

const { user, isLoading, signOut } = useAuth();

const userPending = computed(() => isLoading.value && user.value == null);
const menuDisabled = computed(() => user.value == null);

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: user.value?.name,
    },
  ],
  [
    {
      label: "Profiel",
      icon: "i-lucide-user",
    },
    {
      label: "Uitloggen",
      icon: "i-lucide-log-out",
      onClick: async () => {
        await signOut();
        reloadNuxtApp();
      },
    },
  ],
]);
</script>

<template>
  <UDropdownMenu
    :content="{ align: 'center', collisionPadding: 12 }"
    :disabled="menuDisabled"
    :items="items"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      :square="collapsed"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
      block
      class="data-[state=open]:bg-elevated"
      color="neutral"
      v-bind="{
        trailingIcon:
          collapsed || userPending ? undefined : 'i-lucide-chevrons-up-down',
      }"
      variant="ghost"
    >
      <div v-if="userPending" class="flex flex-row items-center gap-4 w-full">
        <USkeleton class="h-6 w-6 rounded-full" />
        <USkeleton class="h-4 w-[70%]" />
      </div>
      <span v-else class="flex items-center gap-2">
        <UAvatar
          :src="user?.image ?? undefined"
          alt="Profielfoto"
          class="h-6 w-6"
        />
        {{ user?.name ?? "Onbekende gebruiker" }}
      </span>
    </UButton>

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`,
          }"
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
