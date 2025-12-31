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
    <UserAvatar :user="update.user" :team="update.team" size="sm" />
    <span>{{ update.message }}</span>
  </div>
  <article v-else class="w-full scroll-mt-4 sm:scroll-mt-6">
    <div
      class="flex items-start max-w-[80%] gap-3"
      :class="{
        'ltr:justify-end ms-auto': update.me,
        'ltr:justify-start me-auto': !update.me,
      }"
    >
      <div class="inline-flex items-center justify-center min-h-6 mt-2">
        <UserAvatar
          :user="update.user"
          :team="update.team"
          size="lg"
        />
      </div>
      <div
        :class="{
          'bg-primary text-inverted': update.me,
          'bg-elevated/50': !update.me,
        }"
        class="text-pretty min-w-0 *:first:mt-0 *:last:mb-0 bg-elevated/50 px-4 py-3 rounded-lg min-h-12"
      >
        {{ update.message }}
      </div>
    </div>
  </article>
</template>
