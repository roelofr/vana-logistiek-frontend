<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { height } = useWindowSize()
const dummyIssues = computed(() => Array(Math.ceil(height.value / 30)).fill(null).map((_, index) => index))
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div
      v-for="index in dummyIssues"
      :key="index"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 text-toned border-bg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <USkeleton class="h-4 w-35" />
          </div>

          <span>
            <USkeleton class="h-4 w-20" />
          </span>
        </div>
        <p class="truncate">
          <USkeleton class="h-4 w-35" />
        </p>
        <p class="text-dimmed line-clamp-1">
          <USkeleton class="h-3 w-60 max-w-[80%]" />
        </p>
      </div>
    </div>
  </div>
</template>
