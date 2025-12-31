<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { LoadingType, Thread } from '~/types'

const tabItems = [{
  label: 'All',
  value: 'all',
}, {
  label: 'Unread',
  value: 'unread',
}]

const selectedTab = ref('all')
const { data: user } = useUser()

const { data: threads, pending } = await useApi<Thread[]>(() => '/api/threads', {
  default: () => [] as Thread[],
  lazy: true,
})

// Filter threads based on the selected tab
const filteredThreads = computed(() => {
  if (!threads.value)
    return []

  if (selectedTab.value === 'unread') {
    return threads.value.filter((thread) => {
      return !thread.read
        && (thread.user?.id == user.value?.id || thread.team?.id == user.value?.team?.id)
    })
  }

  return threads.value
})

const selectedThread = ref<Thread | null>()

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

// Reset selected mail if it's not in the filtered threads
watch(filteredThreads, () => {
  if (!filteredThreads.value.find(thread => thread.id === selectedThread.value?.id)) {
    selectedThread.value = null
  }
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
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge v-if="!isLoading" :label="filteredThreads.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs
          v-model="selectedTab"
          :items="tabItems"
          :content="false"
          size="xs"
        />
      </template>
    </UDashboardNavbar>
    <ThreadList v-model="selectedThread" :threads="filteredThreads" :loading-type="loadingType" />
  </UDashboardPanel>

  <ThreadMessage v-if="selectedThread" :thread="selectedThread" @close="selectedThread = null" />
  <ThreadEmpty v-else-if="!isMobile" />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isPanelOpen">
      <template #content>
        <ThreadMessage v-if="selectedThread" :thread="selectedThread" @close="selectedThread = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
