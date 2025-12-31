<script lang="ts" setup>
import type { Team, User } from '~/types'

const { user, team, size } = defineProps<{
  user: User
  team: Team | undefined
  size: 'md' | '3xs' | '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | undefined
}>()

const teamComputed = computed<Team>(() => team ?? user.team!)
const colourComputed = computed(() => teamComputed.value.colour ?? 'pink')
</script>

<template>
  <UAvatarGroup>
    <UAvatar :alt="user.name" :size="size" />
    <UAvatar
      class="bg-(--chip-light) dark:bg-(--chip-dark)"
      :style="{
        '--ui-text-muted': 'var(--ui-text-inverted)',
        '--chip-light': `var(--color-${colourComputed}-700)`,
        '--chip-dark': `var(--color-${colourComputed}-500)`,
      }"
      :icon="teamComputed.icon"
      :alt="teamComputed.name"
      :size="size"
    />
  </UAvatarGroup>
</template>
