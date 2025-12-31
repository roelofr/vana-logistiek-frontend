<script lang="ts" setup>
import type ThreadUpdate from '~/components/threads/ThreadUpdate.vue'

const { updates } = defineProps<{
  updates: ThreadUpdate[]
}>()
</script>

<template>
  <UScrollArea class="w-full">
    <div class="flex flex-col flex-1 px-2.5 gap-y-4">
      <ThreadsThreadUpdate v-for="update of updates" :key="update.id" :update="update" />
    </div>
  </UScrollArea>
</template>
