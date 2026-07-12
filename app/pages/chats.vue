<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { breakpointsTailwind } from "@vueuse/core";
import type { Chat } from "~/types";
import { unpackDates } from "~/utils/date-util";

const route = useRoute();

const { data: rawChats } = useLazyFetch<{ chats: Chat[] }>("/api/chats");
const chats = computed<Chat[]>(() =>
  unpackDates(rawChats.value?.chats ?? [], ["createdAt", "updatedAt"]),
);

const activeFilter = ref("active");

// Filter chats based on the selected tab
const filteredChats = computed<Chat[]>(() => {
  if (!chats.value) return [];
  else if (activeFilter.value === "active")
    return chats.value.filter((chat) => {
      if (chat.subject) return chat.subject.resolvedAt == null;
      return chat.state != "Closed";
    });
  else return chats.value;
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
