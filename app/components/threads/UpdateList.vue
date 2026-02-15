<script lang="ts" setup>
import type { ThreadUpdate } from '~/types'

const MAX_INTERVAL = 90 * 1000 // 1,5 min between messages

const { updates } = defineProps<{
  updates: ThreadUpdate[]
}>()

const updatesAsGroup = computed(() => {
  if (!updates)
    return []

  const resultingGroups: ThreadUpdate[][] = []

  updates
    .map((update: ThreadUpdate) => {
      update.date = new Date(update.date)
      return update
    })
    .reduce((previous: ThreadUpdate | null, current: ThreadUpdate): null | ThreadUpdate => {
      if (!['Chat', 'Image'].includes(current.type)) {
        resultingGroups.push([current])
        return null
      }

      if (previous == null || previous.user.id !== current.user.id) {
        resultingGroups.push([current])
        return current
      }

      if ((current.date.getTime() - previous.date.getTime()) > MAX_INTERVAL) {
        resultingGroups.push([current])
        return current
      }

      resultingGroups[resultingGroups.length - 1]!.push(current)
      return current
    }, null)

  return resultingGroups.map((group, index) => ({
    id: index,
    updates: group,
  }))
})
</script>

<template>
  <UScrollArea class="w-full">
    <div class="flex flex-col flex-1 px-2.5 gap-y-4">
      <ThreadsUpdate v-for="group of updatesAsGroup" :key="group.id" :updates="group.updates" />
    </div>
  </UScrollArea>
</template>
