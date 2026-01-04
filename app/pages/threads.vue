<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { ListThread, Thread, ThreadFilter } from '~/types'
import { unreadForUserMap } from '~/utils'
import { breakpointsTailwind } from '@vueuse/core'

definePageMeta({
  key: 'threads-index',
})

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

function reactToRouteChanges(): void {
  isPanelOpen.value = (route.name !== 'threads')

  if (route.name !== 'threads-id') {
    selectedThread.value = null
    return
  }

  const routeIdAsNumber = parseInt(route.params.id as string, 10)
  console.log('Selecting thread %o from route', routeIdAsNumber)
  selectedThread.value = filteredThreads.value.find(thread => thread.id == routeIdAsNumber)
}

watch([route, apiThreads], reactToRouteChanges)
onMounted(reactToRouteChanges)

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
    :class="{
      'message-list': true,
      'message-list--mobile': isMobile,
      'message-list--with-message': selectedThread,
    }"
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
      :loading-type="'full'"
      :threads="filteredThreads"
    />
  </UDashboardPanel>

  <NuxtPage @close="router.push('/threads')" />
</template>

<style scoped>
.message-list--mobile.message-list--with-message {
  display: none;
}
</style>
