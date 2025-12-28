<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { LoadingType, Mail } from '~/types'

const tabItems = [{
  label: 'All',
  value: 'all',
}, {
  label: 'Unread',
  value: 'unread',
}]
const selectedTab = ref('all')

const { data, pending } = await useApi<Mail[]>(() => '/api/threads', {
  default: () => [] as Mail[],
  params: {
    filter: () => selectedTab.value === 'all' ? '' : selectedTab.value,
  },
  lazy: true,
})

const dummyMail = {
  id: 4,
  unread: false,
  from: {
    id: 1,
    name: 'Sam Smith',
    email: 'sam.smith@example.com',
    location: 'Servicegebied',
  },
  subject: 'Ik wil mijn geld terug',
  body: 'Woorden',
  date: new Date().toISOString(),
} as Mail

const threads = computed<Mail[]>(() => {
  if (data.value.length > 0) {
    return data.value
  }

  return [dummyMail]
})

// Filter threads based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === 'unread') {
    return threads.value.filter(mail => !!mail.unread)
  }

  return threads.value
})

const selectedMail = ref<Mail | null>()

const route = useRoute()
watch(route.params, () => {
  const wantedId = route.params.thread
  if (wantedId == undefined || !/^\d+/.test(wantedId)) {
    selectedMail.value = null
    return
  }

  const wantedIdNumber = parseInt(wantedId, 10)
  selectedMail.value = threads.value.find(mail => mail.id == wantedIdNumber)
})

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null
    }
  },
})

// Reset selected mail if it's not in the filtered threads
watch(filteredMails, () => {
  if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null
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
        <UBadge v-if="!isLoading" :label="filteredMails.length" variant="subtle" />
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
    <ThreadList v-model="selectedMail" :threads="filteredMails" :loading-type="loadingType" />
  </UDashboardPanel>

  <ThreadMessage v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
  <ThreadEmpty v-else />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <ThreadMessage v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
