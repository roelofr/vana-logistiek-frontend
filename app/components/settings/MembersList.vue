<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Member } from '~/types'

defineProps<{
  members: Member[]
}>()

const items = [{
  label: 'Edit member',
  onSelect: () => console.log('Edit member'),
}, {
  label: 'Remove member',
  color: 'error' as const,
  onSelect: () => console.log('Remove member'),
}] satisfies DropdownMenuItem[]
</script>

<template>
  <ul class="divide-y divide-default" role="list">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          size="md"
          v-bind="member.avatar"
        />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :items="['member', 'owner']"
          :model-value="member.role"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
          color="neutral"
        />

        <UDropdownMenu :content="{ align: 'end' }" :items="items">
          <UButton
            color="neutral"
            icon="i-lucide-ellipsis-vertical"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
