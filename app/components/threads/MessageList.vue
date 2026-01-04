<script setup lang="ts">
import type { ListThread, LoadingType, Thread } from '~/types'
import { localTime } from '~/utils'

const router = useRouter()
const selectedThread = defineModel<ListThread | Thread | null>()
const { threads, loadingType } = defineProps<{
  loadingType: LoadingType
  threads: ListThread[]
}>()

const threadRefs = ref<Element[]>([])
const threadRoute = (thread: Thread) => `/threads/${thread.id}`

watch(selectedThread, () => {
  if (!selectedThread.value)
    return

  const ref = threadRefs.value[selectedThread.value.id]
  if (ref)
    ref.scrollIntoView({ block: 'nearest' })
})

defineShortcuts({
  arrowdown: async () => {
    const index = threads.findIndex(thread => thread.id === selectedThread.value?.id)

    if (index === -1)
      await router.push(
        threadRoute(threads[0] as Thread),
      )
    else if (index < threads.length - 1)
      await router.push(threadRoute(threads[index + 1] as Thread))
  },
  arrowup: async () => {
    const index = threads.findIndex(thread => thread.id === selectedThread.value?.id)

    if (index === -1)
      await router.push(threadRoute(threads[threads.length - 1] as Thread))
    else if (index > 1)
      await router.push(threadRoute(threads[index - 1] as Thread))
  },
})
</script>

<template>
  <template v-if="loadingType == 'full'">
    <div
      v-for="index in Array(30)"
      :key="index"
    >
      <div
        class="space-y-1 p-4 sm:px-6 text-sm border-l-2 transition-colors border-bg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <USkeleton class="h-4 w-35" />
          </div>

          <USkeleton class="h-4 w-10" />
        </div>

        <p class="truncate">
          <USkeleton class="h-4 w-50" />
        </p>

        <p class="text-dimmed line-clamp-1">
          <USkeleton class="h-4 w-full" />
        </p>
      </div>
    </div>
  </template>
  <template v-else>
    <UProgress v-show="loadingType == 'partial'" size="xs" class="mb-[-100%]" />
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
        v-for="thread in threads"
        :key="thread.id"
        :ref="el => { threadRefs[thread.id] = el as Element }"
      >
        <NuxtLink
          :href="threadRoute(thread)"
          prefetch-on="interaction"
          class="block p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
          :class="[
            thread.read ? 'text-toned' : 'text-highlighted',
            selectedThread?.id === thread.id
              ? 'border-primary bg-primary/10'
              : 'border-bg hover:border-primary hover:bg-primary/5',
          ]"
        >
          <div :class="[thread.read || 'font-semibold']" class="flex items-center justify-between max-w-full">
            <div class="flex items-start gap-3">
              <div class="flex-none text-muted">{{ thread.vendor.number }}</div>
              <div>{{ thread.vendor.name }}</div>
              <UChip v-if="!thread.read" class="flex-none self-center" />
            </div>

            <div class="flex-none pl-2">{{ localTime(thread.updatedAt) }}</div>
          </div>
          <p :class="[thread.read || 'font-semibold']" class="truncate">
            {{ thread.subject }}
          </p>
        </NuxtLink>
      </div>
    </template>
  </template>
</template>
