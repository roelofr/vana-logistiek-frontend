<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {breakpointsTailwind} from "@vueuse/core";
import type {Chat, ListChat} from "~/types";

const {data, pending, refresh} = useLazyFetch<{ chats: ListChat[] }>("/api/chats");
const chats = computed<ListChat[]>(() => (data.value?.chats ?? [])
  .map(chat => ({
    ...chat,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
  })))

const activeFilter = ref("all");

// Filter issues based on the selected tab
const filteredChats = computed<ListChat[]>(() => {
  if (!chats.value)
    return [];
  else if (activeFilter.value === "unread")
    return chats.value.filter(() => false);
  else
    return chats.value;
})

const selectedIssueId = ref<number | null>(null);
const selectedIssue = computed<ListChat | null>({
  get: () => chats.value?.find((issue) => issue.id === selectedIssueId.value) ?? null,
  set: (chat: Chat | ListChat | null) => selectedIssueId.value = chat?.id ?? null,
});

const isMailPanelOpen = computed({
  get: () => !!selectedIssue.value,
  set: (value: boolean) => (!value) ? selectedIssue.value = null : null,
});

// Reset selected issue if it's not in the filtered issues
watch(filteredChats, () => {
  if (
    !filteredChats.value.find((issue) => issue.id === selectedIssue.value?.id)
  ) {
    selectedIssue.value = null;
  }
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
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
        <UDashboardSidebarCollapse/>
      </template>
      <template #trailing>
        <UBadge :label="filteredChats.length" variant="subtle"/>
        <UButton
          icon="i-lucide-refresh-cw"
          size="md"
          variant="ghost"
          @click="refresh()"/>
      </template>

      <template #right>
        <IssueListFilter v-model="activeFilter"/>
      </template>
    </UDashboardNavbar>
    <IssueList v-model="selectedIssue" :issues="filteredChats"/>
  </UDashboardPanel>

  <IssueBody
    v-if="selectedIssue"
    :issue="selectedIssue"
    @close="selectedIssue = null"
  />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed"/>
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <IssueBody
          v-if="selectedIssue"
          :issue="selectedIssue"
          @close="selectedIssue = null"
        />
      </template>
    </USlideover>
  </ClientOnly>
</template>
