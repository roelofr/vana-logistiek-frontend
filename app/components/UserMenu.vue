<script lang="ts" setup>
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
    :content="{ align: 'center', collisionPadding: 12 }"
    :disabled="menuDisabled"
    :items="items"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
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
        trailingIcon: (collapsed || userPending) ? undefined : 'i-lucide-chevrons-up-down',
      }"
      variant="ghost"
    >
      <div v-if="userPending" class="flex flex-row items-center gap-4 w-full">
        <USkeleton class="h-6 w-6 rounded-full" />
        <USkeleton class="h-4 w-[70%]" />
      </div>
      <UPopover v-else-if="menuDisabled">
        <UButton
          :square="collapsed"
          block
          class="data-[state=open]:bg-elevated"
          color="neutral"
          variant="ghost"
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
