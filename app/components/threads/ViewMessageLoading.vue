<script setup lang="ts">
import type { ListThread } from '~/types'

const { threadId, thread } = defineProps<{
  threadId: number | string
  thread?: ListThread | null
}>()

const emits = defineEmits(['close'])
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="`Melding ${thread?.id ?? threadId}`" :toggle="false">
      <template #leading>
        <UButton
          class="-ms-1.5"
          color="neutral"
          icon="i-lucide-x"
          variant="ghost"
          @click="emits('close')"
        />
      </template>
    </UDashboardNavbar>

    <div class="p-4 sm:px-6 border-b border-default">
      <div class="font-semibold text-lg">
        <USkeleton class="w-[40%] h-4" />
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <div class="min-w-0 gap-1">
          <p class="font-semibold text-highlighted">
            <USkeleton class="h-4 w-20 pb-1" />
          </p>
          <div class="text-muted flex flex-row items-center gap-2">
            <USkeleton class="h-4 w-8 rounded-full" />
            <USkeleton class="h-4 w-30" />
          </div>
        </div>
      </div>

      <p class="text-muted text-sm sm:mt-2">
        <USkeleton />
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6">
      <div class="my-4 flex flex-row items-center justify-center gap-2 text-dimmed">
        <UIcon class="animate-spin" name="i-lucide-loader" size="20" />
        <span>Berichten worden opgehaald...</span>
      </div>
    </div>
  </UDashboardPanel>
</template>
