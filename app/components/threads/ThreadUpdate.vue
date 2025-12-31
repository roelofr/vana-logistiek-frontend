<script lang="ts" setup>
import type { ThreadUpdate } from '~/types'

const { update } = defineProps<{
  update: ThreadUpdate
}>()
</script>

<template>
  <div
    v-if="update.type == 'System'"
    class="text-dimmed text-center flex flex-row items-center justify-center gap-2"
  >
    <UAvatarGroup>
      <UAvatar :alt="update.team.name" size="sm" />
      <UAvatar :alt="update.user.name" size="sm" />
    </UAvatarGroup>
    <span>{{ update.message }}</span>
  </div>
  <article v-else class="w-full scroll-mt-4 sm:scroll-mt-6">
    <div class="flex items-start ltr:justify-end ms-auto max-w-[75%] gap-3">
      <div class="inline-flex items-center justify-center min-h-6 mt-2">
        <UAvatar v-if="update.me" :alt="update.user.name" size="lg" />
        <UAvatarGroup v-else>
          <UAvatar :alt="update.team.name" size="lg" />
          <UAvatar :alt="update.user.name" size="lg" />
        </UAvatarGroup>
      </div>
      <div
        class="text-pretty min-w-0 *:first:mt-0 *:last:mb-0 bg-elevated/50 px-4 py-3 rounded-lg min-h-12"
        :class="{
          'bg-primary text-inverted': update.me,
          'bg-elevated/50': !update.me,
        }"
      >
        {{ update.message }}
      </div>
    </div>
  </article>
</template>
