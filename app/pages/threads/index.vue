<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { LoadingType, Thread } from '~/types'

const { data: user } = useUser()
const route = useRoute()
const toast = useToast()
const router = useRouter()

definePageMeta({
  keepalive: true,
})

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
  lazy: route.params?.id == null,
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

const openThread = (thread: Thread) => {
  router.push(`/threads/${thread.id}`)
  selectedThread.value = thread
}

const closeThread = () => {
  router.push('/threads')
  selectedThread.value = null
}

const selectedThread = ref<Thread | null>()
watch([route, threads], () => {
  if (!route.params.id || !(route.params.id as string).match(/^\d{1,4}$/)) {
    selectedThread.value = null
    return
  }

  // Still loading?
  if (!threads.value)
    return

  const wantedId = parseInt(route.params.id as string, 10)
  const foundId = threads.value?.find(t => t.id === wantedId)
  if (foundId)
    selectedThread.value = foundId
  else
    toast.add({
      color: 'warning',
      title: 'Melding niet gevonden',
      description: 'De gevraagde melding is niet beschikbaar',
    })
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
          :content="false"
          :items="tabItems"
          size="xs"
        />
      </template>
    </UDashboardNavbar>
    <ThreadList
      v-model="selectedThread"
      :loading-type="loadingType"
      :threads="filteredThreads"
      @open="openThread"
    />
  </UDashboardPanel>

  <ThreadMessage v-if="selectedThread" :thread="selectedThread" @close="closeThread" />
  <ThreadEmpty v-else-if="!isMobile" />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isPanelOpen">
      <template #content>
        <ThreadMessage v-if="selectedThread" :thread="selectedThread" @close="closeThread" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
