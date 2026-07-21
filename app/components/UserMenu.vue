<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  collapsed?: boolean;
}>();

const { loggedIn, logout, user, name, avatar, group, refresh } = useSession();

const workModalOpen = ref(false);
const userPending = computed(() => !user.value);
const menuDisabled = computed(() => !loggedIn || user.value == null);

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Profiel",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Werkstatus",
      icon: "i-lucide-pickaxe",
      onClick: () => (workModalOpen.value = true),
    },
  ],
  [
    {
      label: "Sessie vernieuwen",
      icon: "i-lucide-rotate-ccw",
      onClick: async () => {
        await refresh();
      },
    },
    {
      label: "Uitloggen",
      icon: "i-lucide-log-out",
      onClick: async () => {
        const redirectUrl = new URL("/", document.location.origin).toString();
        await logout("oidc", redirectUrl);
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
        <USkeleton v-if="!collapsed" class="h-4 w-[70%]" />
      </div>
      <span v-else class="flex items-center gap-2">
        <UAvatar
          v-if="collapsed"
          :src="avatar"
          :alt="name"
          class="w-6 h-6"
          loading="lazy"
        />
        <template v-else>
          <UAvatarGroup>
            <UAvatar :src="avatar" :alt="name" class="w-6 h-6" loading="lazy" />
            <GroupAvatar
              v-if="group"
              :group="group"
              class="w-6 h-6"
              loading="lazy"
            />
          </UAvatarGroup>
          {{ name ?? "Onbekende gebruiker" }}
        </template>
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

  <UserActiveModal v-model:open="workModalOpen" />
</template>
