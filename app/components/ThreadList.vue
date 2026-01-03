<script lang="ts" setup>
import type { LoadingType, Thread } from '~/types'
import { localTime } from '~/utils'

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  threads: Thread[]
  loadingType: LoadingType
}>()

const threadRefs = ref<Element[]>([])

const selectedThread = computed(() => {
  if (!route.params?.id || !props.threads?.length)
    return null

  try {
    const paramId = parseInt(route.params.id as string, 10)
    return props.threads.find(thread => thread.id == paramId)
  } catch (e) {
    console.log('Param ID %o is not a number, somehow: %o', route.params.id, e)
    return null
  }
})

watch(selectedThread, () => {
  if (!selectedThread.value)
    return

  const ref = threadRefs.value[selectedThread.value.id]
  if (ref)
    ref.scrollIntoView({ block: 'nearest' })
})

const threadRoute = (thread: Thread) => `/threads/${thread.id}`

defineShortcuts({
  arrowdown: async () => {
    const index = props.threads.findIndex(mail => mail.id === selectedThread.value?.id)

    if (index === -1)
      await router.push(
        threadRoute(props.threads[0] as Thread),
      )
    else if (index < props.threads.length - 1)
      await router.push(threadRoute(props.threads[index + 1] as Thread))
  },
  arrowup: async () => {
    const index = props.threads.findIndex(mail => mail.id === selectedThread.value?.id)

    if (index === -1)
      await router.push(threadRoute(props.threads[props.threads.length - 1] as Thread))
    else if (index < props.threads.length - 1)
      await router.push(threadRoute(props.threads[index - 1] as Thread))
  },
})
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
        >
          <NuxtLink
            :href="threadRoute(thread)"
            prefetch-on="interaction"
            class="block p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
            :class="[
              thread.read ? 'text-toned' : 'text-highlighted',
              selectedThread && selectedThread.id === thread.id
                ? 'border-primary bg-primary/10'
                : 'border-(--ui-bg) hover:border-primary hover:bg-primary/5',
            ]"
          >
            <div :class="[thread.read || 'font-semibold']" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-muted">{{ thread.vendor.number }}</span>
                <span>{{ thread.vendor.name }}</span>
                <UChip v-if="!thread.read" />
              </div>

              <span>{{ localTime(thread.updatedAt) }}</span>
            </div>
            <p :class="[thread.read || 'font-semibold']" class="truncate">
              {{ thread.subject }}
            </p>
          </NuxtLink>
        </div>
      </template>
    </template>
  </div>
</template>
