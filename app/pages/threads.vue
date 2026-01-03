<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { LoadingType, Thread } from '~/types'

const { data: user } = useUser()
const route = useRoute()
const toast = useToast()
const router = useRouter()

const tabItems = [{
  label: 'All',
  value: 'all',
}, {
  label: 'Unread',
  value: 'unread',
}]

const selectedTab = ref('all')

const { data: threads, pending } = await useApi<Thread[]>(() => '/api/threads', {
  default: () => [] as Thread[],
  lazy: route.name !== 'threads-id',
})

watch(route, () => {
  console.log('Route changed: %s with (id: %o)', route.name, route.params.id)
})

const expandedThreads = computed(() => {
  const expanded = expand(threads.value, ['user', 'team', 'vendor'])

  expanded.forEach((thread) => {
    if (thread.team?.id !== user.value?.team?.id)
      thread.read = true
  })

  return expanded
})

// Filter threads based on the selected tab
const filteredThreads = computed(() => {
  const threads = expandedThreads.value
  if (!threads)
    return []

  if (selectedTab.value === 'unread')
    return threads.filter(thread => !thread.read
      && (
        thread.user?.id == user.value?.id
        || thread.team?.id == user.value?.team?.id
      ))

  return threads
})

const selectedThread = computed<Thread | null>(() => {
  const paramId = route.params.id
  if (!paramId)
    return null

  try {
    const paramIdNumeric = parseInt(paramId as string, 10)
    const thread = expandedThreads.value.find(t => t.id === paramIdNumeric) ?? null
    if (thread)
      return thread

    toast.add({
      color: 'warning',
      title: 'Melding niet gevonden',
      description: 'De gevraagde melding is niet beschikbaar',
    })
    router.replace('/threads')

    return null
  } catch (err) {
    console.warn('Failed to convert ID to number: %o', err)
    return null
  }
})

const isPanelOpen = computed({
  get() {
    return !!selectedThread.value
  },
  set(value: boolean) {
    if (!value) {
      selectedThread.value = null
    }
  },
})

const isLoading = computed(() => pending.value)
const hasCompletedLoadingOnce = ref(false)
watch(isLoading, (value) => {
  if (!value)
    hasCompletedLoadingOnce.value = true
})
const loadingType = computed<LoadingType>(() => {
  if (!isLoading.value)
    return null
  if (!hasCompletedLoadingOnce.value)
    return 'full'
  return 'partial'
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <UDashboardPanel
    id="inbox-1"
    :default-size="25"
    :max-size="30"
    :min-size="20"
    resizable
  >
    <UDashboardNavbar title="Meldingen">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge v-if="!isLoading" :label="filteredThreads.length" variant="subtle" />
      </template>

      <template #right>
        <ClientOnly>
          <UTabs
            v-model="selectedTab"
            :content="false"
            :items="tabItems"
            size="xs"
          />
        </ClientOnly>
      </template>
    </UDashboardNavbar>
    <ThreadList
      v-model="selectedThread"
      :loading-type="loadingType"
      :threads="filteredThreads"
    />
  </UDashboardPanel>

  <NuxtPage :thread="selectedThread" @close="router.push('/threads')" />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isPanelOpen" @close="router.push('/threads')">
      <template #content>
        <NuxtPage :thread="selectedThread" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
