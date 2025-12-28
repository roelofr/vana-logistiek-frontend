<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useUser } from '~/composables/useUser'

defineProps<{
  collapsed?: boolean
}>()

const { data: user, status: userStatus, pending: userPending } = useUser({ lazy: true })

const userError = computed(() => userStatus.value == 'error')
const menuDisabled = computed(() => (userPending.value || userError.value))

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
      <UPopover v-else-if="menuDisabled">
        <UButton
          color="neutral"
          variant="ghost"
          block
          :square="collapsed"
          class="data-[state=open]:bg-elevated"
        >
          Sam Smith
        </UButton>

        <template #content>
          <pre><code>{{ JSON.stringify(user, undefined, 4) }}</code></pre>
        </template>
      </UPopover>
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
