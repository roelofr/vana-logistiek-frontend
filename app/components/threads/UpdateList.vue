<script lang="ts" setup>
import type { ThreadUpdate } from '~/types'

const { updates } = defineProps<{
  updates: ThreadUpdate[]
}>()

const updatesAsGroup = computed(() => {
  const resultingGroups: ThreadUpdate[][] = []

  updates?.reduce((previous: ThreadUpdate | null, current: ThreadUpdate): null | ThreadUpdate => {
    if (current.type !== 'Chat') {
      resultingGroups.push([current])
      return null
    }

    if (previous == null || previous.user.id !== current.user.id) {
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
