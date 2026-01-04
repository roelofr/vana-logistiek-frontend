<script lang="ts" setup>
import { computed, ref } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { ListThread, Thread, ThreadFilter } from '~/types'
import { unreadForUserMap } from '~/utils'

const { data: user } = useUser()
const router = useRouter()
const route = useRoute()

const isPanelOpen = ref(false)
const selectedThread = ref<Thread | null>(null)
const activeFilter = ref<ThreadFilter>('all')

const {
  data: apiThreads,
  status: threadsStatus,
} = useApi<ListThread[]>('/api/threads', {
  lazy: true,
  params: {
    closed: activeFilter.value === 'all',
  },
})

const isLoading = computed(() => threadsStatus.value !== 'success')
const threads = computed(() => expand(apiThreads.value, ['user', 'team', 'vendor']).map(unreadForUserMap(user.value!)))

// Filter threads based on the selected tab
const filteredThreads = computed(() => {
  if (!threads.value)
    return []

  if (activeFilter.value !== 'unread')
    return threads.value

  return threads.value.filter(thread => !thread.read
    && (
      thread.user?.id == user.value?.id
      || thread.team?.id == user.value?.team?.id
    ))
})

watch([route], () => {
  isPanelOpen.value = (route.name !== 'threads')
  if (route.name === 'threads-id') {
    const routeIdAsNumber = parseInt(route.params.id as string, 10)
    selectedThread.value = filteredThreads.value.find(thread => thread.id == routeIdAsNumber)
  }
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
            v-model="activeFilter"
            :content="false"
            size="xs"
          />
        </ClientOnly>
      </template>
    </UDashboardNavbar>
    <ThreadsMessageList
      v-model="selectedThread"
      :loading-type="activeFilter"
      :threads="filteredThreads"
    />
  </UDashboardPanel>

  <NuxtPage @close="router.push('/threads')" />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isPanelOpen" @close="router.push('/threads')">
      <template #content>
        <NuxtPage />
      </template>
    </USlideover>
  </ClientOnly>
</template>
