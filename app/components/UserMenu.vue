<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '~/types'

defineProps<{
  collapsed?: boolean
}>()

const { pending: userPending, data: user, status: userStatus } = useApi<User>('/api/user/me', {
  lazy: true,
})

const menuDisabled = computed(() => userPending.value || userStatus.value !== 'success')

const items = computed<DropdownMenuItem[][]>(() => ([[
  {
    type: 'label',
    label: user.value?.name,
  },
], [
  {
    label: 'Profiel',
    icon: 'i-lucide-user',
  },
  {
    label: 'Uitloggen',
    icon: 'i-lucide-log-out',
  },
]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
    :disabled="menuDisabled"
  >
    <UButton
      v-bind="{
        trailingIcon: (collapsed || userPending) ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    >
      <div v-if="userPending" class="flex flex-row items-center gap-4 w-full">
        <USkeleton class="h-6 w-6 rounded-full" />
        <USkeleton class="h-4 w-[70%]" />
      </div>
      <span v-else-if="menuDisabled">Sam Smith</span>
      <span v-else>{{ user?.name }}</span>
    </UButton>

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`,
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
