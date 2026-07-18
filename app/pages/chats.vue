<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { breakpointsTailwind } from "@vueuse/core";
import type { Chat } from "~/types";

const route = useRoute();
const { chats, refresh: refreshChats, pending: isLoading } = useChats();

const defaultTypeFilter = "active";
const defaultSortFilter = "updated-at";

const activeTypeFilter = ref(defaultTypeFilter);
const activeSortFilter = ref(defaultSortFilter);

const filterActive = computed(() =>
  Boolean(
    activeTypeFilter.value !== defaultTypeFilter ||
    activeSortFilter.value !== defaultSortFilter,
  ),
);

// Filter chats based on the selected tab
const filteredChats = computed<Chat[]>(() => {
  if (!chats.value) return [];

  const activeFilter = activeTypeFilter.value;

  if (activeFilter === "active")
    return chats.value!.filter((chat) => {
      if (chat.subject) return chat.subject.resolvedAt == null;
      return chat.state != "closed";
    });

  if (activeFilter === "inactive")
    return chats.value!.filter((chat) => {
      if (chat.subject) return chat.subject.resolvedAt != null;
      return chat.state == "closed";
    });

  return chats.value!;
});

const sortedChats = computed<Chat[]>(() => {
  const activeSort = activeSortFilter.value;

  // Updated-at is default sort
  if (activeSort === "updated-at")
    return filteredChats.value.toSorted(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    );

  if (activeSort === "created-at")
    return filteredChats.value.toSorted(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

  if (activeSort === "vendor-id")
    return filteredChats.value.toSorted(
      (a, b) => (a.subject?.vendor?.id ?? 0) - (b.subject?.vendor?.id ?? 0),
    );

  return filteredChats.value;
});

const selectedChatId = ref<number | undefined>();
const selectedChat = computed<Chat | undefined>({
  get: () => {
    const selectedChat = selectedChatId.value; // Assign here so Vue can resolve the usage on an empty list
    return chats.value?.find((issue) => issue.id === selectedChat);
  },
  set: (chat: Chat | undefined) =>
    (selectedChatId.value = chat?.id ?? undefined),
});

const isMailPanelOpen = computed({
  get: () => !!selectedChat.value,
  set: (value: boolean) => (!value ? (selectedChat.value = undefined) : null),
});

// Change the selected chat if an ID is present as param
watch(
  () => route.params,
  (newParams, oldParams) => {
    if (!newParams.id && oldParams.id) {
      selectedChatId.value = undefined;
      return;
    }

    if (newParams.id && String(newParams.id).match(/^\d+$/)) {
      selectedChatId.value = Number.parseInt(newParams.id as string, 10);
      isMailPanelOpen.value = true;
    }
  },
);

onMounted(() => {
  if (route.params.id && String(route.params.id).match(/^\d+$/)) {
    selectedChatId.value = Number.parseInt(route.params.id as string, 10);
    isMailPanelOpen.value = true;
  }
});

const { idle: userIsIdle } = useIdle(5 * 60 * 1000); // 5 min
const { pause: pauseRefreshTimer, resume: resumeRefreshTimer } = useIntervalFn(
  () => refreshChats(),
  30_000,
);

watch(userIsIdle, (isIdle) => {
  if (isIdle) return pauseRefreshTimer();

  resumeRefreshTimer();
  refreshChats();
});

// Reset selected issue if it's not in the filtered chats
watch(filteredChats, () => {
  if (
    !filteredChats.value.find((issue) => issue.id === selectedChat.value?.id)
  ) {
    selectedChat.value = undefined;
  }
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
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
        <UBadge :label="filteredChats.length" variant="subtle" />
      </template>

      <template #right>
        <ChatListFilter
          :active="filterActive"
          v-model:sort="activeSortFilter"
          v-model:type="activeTypeFilter"
        />
      </template>
    </UDashboardNavbar>
    <ChatList
      v-model="selectedChat"
      :chats="filteredChats"
      :loading="Boolean(isLoading && !chats)"
    />
  </UDashboardPanel>

  <NuxtPage />

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <NuxtPage />
      </template>
    </USlideover>
  </ClientOnly>
</template>
