<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'

const { issues, fetch, loadingState, activeIssue } = useIssueStore()
onMounted(() => loadingState === LoadingState.Initial && fetch())

const activeFilter = ref('all')

// Filter issues based on the selected tab
const filteredIssues = computed(() => {
  if (!issues.value)
    return []

  if (activeFilter.value === 'unread') {
    return issues.value.filter(issue => !!issue.unread)
  }

  return issues.value
})

const selectedIssue = computed<ListIssue>({
  get: () => activeIssue,
  set: value => setActiveIssue(value),
})

const isMailPanelOpen = computed({
  get() {
    return !!selectedIssue.value
  },
  set(value: boolean) {
    if (!value) {
      selectedIssue.value = null
    }
  },
})

// Reset selected issue if it's not in the filtered issues
watch(filteredIssues, () => {
  if (!filteredIssues.value.find(issue => issue.id === selectedIssue.value?.id)) {
    selectedIssue.value = null
  }
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
        <UBadge :label="filteredIssues.length" variant="subtle" />
      </template>

      <template #right>
        <IssueListFilter v-model="activeFilter" />
      </template>
    </UDashboardNavbar>
    <IssueList v-model="selectedIssue" :issues="filteredIssues" />
  </UDashboardPanel>

  <IssueBody v-if="selectedIssue" :issue="selectedIssue" @close="selectedIssue = null" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <IssueBody v-if="selectedMail" :issue="selectedMail" @close="selectedMail = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
