<script lang="ts" setup>
import { format, isToday } from 'date-fns'
import type { LoadingType, Thread } from '~/types'

const props = defineProps<{
  threads: Thread[]
  loadingType: LoadingType
}>()

const threadRefs = ref<Element[]>([])

const selectedThread = defineModel<Thread | null>()

watch(selectedThread, () => {
  if (!selectedThread.value)
    return

  const ref = threadRefs.value[selectedThread.value.id]
  if (ref)
    ref.scrollIntoView({ block: 'nearest' })
})

const selectThread = (_thread) => {
  //
}

defineShortcuts({
  arrowdown: () => {
    const index = props.threads.findIndex(mail => mail.id === selectedThread.value?.id)

    if (index === -1) {
      selectedThread.value = props.threads[0]
    } else if (index < props.threads.length - 1) {
      selectedThread.value = props.threads[index + 1]
    }
  },
  arrowup: () => {
    const index = props.threads.findIndex(mail => mail.id === selectedThread.value?.id)

    if (index === -1) {
      selectedThread.value = props.threads[props.threads.length - 1]
    } else if (index > 0) {
      selectedThread.value = props.threads[index - 1]
    }
  },
})

const threadDate = (thread: Thread): string => {
  const date = new Date(thread.updatedAt)

  return isToday(date)
    ? format(new Date(thread.updatedAt), 'HH:mm')
    : format(new Date(thread.updatedAt), 'dd MMM')
}
</script>

<template>
  <div :class="[loadingType == 'full' ? 'overflow-y-hidden' : 'overflow-y-auto']" class="divide-y divide-default">
    <template v-if="loadingType == 'full'">
      <div
        v-for="index in Array(30)"
        :key="index"
      >
        <div
          class="space-y-1 p-4 sm:px-6 text-sm border-l-2 transition-colors border-(--ui-bg)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <USkeleton class="h-4 w-[140px]" />
            </div>

            <USkeleton class="h-4 w-[40px]" />
          </div>

          <p class="truncate">
            <USkeleton class="h-4 w-[200px]" />
          </p>

          <p class="text-dimmed line-clamp-1">
            <USkeleton class="h-4 w-full" />
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <UProgress v-show="loadingType == 'partial'" size="xs" />
      <template v-if="threads.length == 0">
        <UEmpty
          description="Het lijkt er op dat er nog geen meldingen zijn, lekker bezig!"
          icon="i-lucide-inbox"
          title="Geen meldingen gevonden"
          variant="naked"
        />
      </template>
      <template v-else>
        <div
          v-for="(thread, index) in threads"
          :key="index"
          :ref="el => { threadRefs[thread.id] = el as Element }"
          @click.prevent="selectThread(thread)"
        >
          <div
            :class="[
              thread.read ? 'text-toned' : 'text-highlighted',
              selectedThread && selectedThread.id === thread.id
                ? 'border-primary bg-primary/10'
                : 'border-(--ui-bg) hover:border-primary hover:bg-primary/5',
            ]"
            class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
            @click="selectedThread = thread"
          >
            <div :class="[thread.read || 'font-semibold']" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-muted">{{ thread.vendor.number }}</span>
                <span>{{ thread.vendor.name }}</span>
                <UChip v-if="!thread.read" />
              </div>

              <span>{{ threadDate(thread) }}</span>
            </div>
            <p :class="[thread.read || 'font-semibold']" class="truncate">
              {{ thread.subject }}
            </p>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
