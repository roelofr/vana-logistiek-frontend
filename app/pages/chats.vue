<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { breakpointsTailwind } from "@vueuse/core";
import type { Chat, ListChat } from "~/types";

const route = useRoute();

const { data: rawChats } = useLazyFetch<{ chats: ListChat[] }>("/api/chats");
const chats = computed<ListChat[]>(() =>
  (rawChats.value?.chats ?? []).map((chat) => ({
    ...chat,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
  })),
);

const activeFilter = ref("all");

// Filter chats based on the selected tab
const filteredChats = computed<ListChat[]>(() => {
  if (!chats.value) return [];
  else if (activeFilter.value === "unread")
    return chats.value.filter((chat) => chat.unread);
  else return chats.value;
});

const selectedChatId = ref<number | undefined>();
const selectedChat = computed<ListChat | undefined>({
  get: () => {
    const selectedChat = selectedChatId.value; // Assign here so Vue can resolve the usage on an empty list
    return chats.value?.find((issue) => issue.id === selectedChat);
  },
  set: (chat: Chat | ListChat | undefined) =>
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
    :min-size="20"
    :max-size="30"
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
        <ChatListFilter v-model="activeFilter" />
      </template>
    </UDashboardNavbar>
    <ChatList v-model="selectedChat" :chats="filteredChats" />
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
