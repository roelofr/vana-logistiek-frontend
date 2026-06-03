<script setup lang="ts">
import type { Issue, LoadingType } from '~/types'
import { localTime } from '~/utils'

const threadCount = useCookie<number>('expected-threads')

const selectedIssue = defineModel<ListIssue | Issue | null>()
const { issues, loadingType } = defineProps<{
  loadingType: LoadingType
  issues: ListIssue[]
}>()

const threadRefs = ref<Element[]>([])

const expectedThreadCount = computed(() => (threadCount.value > 0 ? threadCount.value : 30))

watch(
  () => issues,
  () => {
    if (issues.length) threadCount.value = Math.min(30, Math.max(5, issues.length))
  },
)

watch(selectedIssue, () => {
  if (!selectedIssue.value) return

  const ref = threadRefs.value[selectedIssue.value.id]
  if (ref) ref.scrollIntoView({ block: 'nearest' })
})

defineShortcuts({
  arrowdown: async () => {
    const index = issues.findIndex(thread => thread.id === selectedIssue.value?.id)

    if (index === -1) selectedIssue.value = issues[0] ?? null
    else if (index < issues.length - 1)
      selectedIssue.value = issues[index + 1]
  },
  arrowup: async () => {
    const index = issues.findIndex(thread => thread.id === selectedIssue.value?.id)

    if (index === -1) selectedIssue.value = issues[issues.length - 1]
    else if (index > 1) selectedIssue.value = issues[index - 1]
  },
})
</script>

<template>
  <template v-if="loadingType == 'full'">
    <div v-for="index in Array(expectedThreadCount)" :key="index">
      <div class="space-y-1 p-4 sm:px-6 text-sm border-l-2 transition-colors border-bg">
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
    <template v-if="issues.length == 0">
      <UEmpty
        description="Het lijkt er op dat er nog geen meldingen zijn, lekker bezig!"
        icon="i-lucide-inbox"
        title="Geen meldingen gevonden"
        variant="naked"
      />
    </template>
    <template v-else>
      <p v-for="issue in issues" :key="issue.id">
        Hello issue {{ issue.id }}
      </p>
    </template>
  </template>
</template>
