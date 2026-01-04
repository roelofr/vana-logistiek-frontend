<script lang="ts" setup>
import type { ThreadUpdate } from '~/types'
import { localTime } from '~/utils'

const { updates } = defineProps<{
  updates: ThreadUpdate[]
}>()

const update = computed(() => updates[updates.length - 1]!)
</script>

<template>
  <div
    v-if="update.type == 'System'"
    class="text-dimmed text-center leading-tight"
  >
    <template v-if="update.updateType == 'Created'">
      {{ update.message.split(update.user.name, 2)[0] }}
      <UserAvatar
        :user="update.user"
        :team="update.team"
        size="xs"
        class="pe-1"
      />
      {{ update.user.name + update.message.split(update.user.name, 2)[1] }}
    </template>
    <template v-else>
      {{ update.message }}
    </template>
  </div>
  <article v-else class="w-full scroll-mt-4 sm:scroll-mt-6">
    <div
      class="flex items-start max-w-[80%] gap-3"
      :class="{
        'ltr:justify-end ms-auto': update.me,
        'ltr:justify-start me-auto': !update.me,
      }"
    >
      <div class="min-h-6 mt-2">
        <UserAvatar
          v-if="!update.me"
          :user="update.user"
          :team="update.team"
          size="lg"
        />
      </div>
      <div
        class="flex flex-col gap-y-1"
        :class="{
          'ltr:items-end': update.me,
          'ltr:items-start': !update.me,
        }"
      >
        <div
          v-for="updateItem of updates"
          :key="updateItem.id"
          :class="{
            'bg-primary text-inverted': update.me,
            'bg-elevated/50': !update.me,
          }"
          class="text-pretty min-w-0 *:first:mt-0 *:last:mb-0 bg-elevated/50 px-4 py-3 rounded-lg min-h-12"
        >
          {{ updateItem.message }}
        </div>
        <time class="text-sm text-muted">{{ localTime(update.date) }}</time>
      </div>
    </div>
  </article>
</template>
