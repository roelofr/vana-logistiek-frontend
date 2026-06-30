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

// Filter chats based on the selected tab
const filteredChats = computed<ListChat[]>(() => {
  if (!chats.value)
    return [];
  else if (activeFilter.value === "unread")
    return chats.value.filter(chat => chat.unread);
  else
    return chats.value;
})

const selectedChatId = ref<number | null>(null);
const selectedChat = computed<ListChat | null>({
  get: () => chats.value?.find((issue) => issue.id === selectedChatId.value) ?? null,
  set: (chat: Chat | ListChat | null) => selectedChatId.value = chat?.id ?? null,
});

const isMailPanelOpen = computed({
  get: () => !!selectedChat.value,
  set: (value: boolean) => (!value) ? selectedChat.value = null : null,
});

// Reset selected issue if it's not in the filtered chats
watch(filteredChats, () => {
  if (
    !filteredChats.value.find((issue) => issue.id === selectedChat.value?.id)
  ) {
    selectedChat.value = null;
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
      </template>

      <template #right>
        <ChatListFilter v-model="activeFilter"/>
      </template>
    </UDashboardNavbar>
    <ChatList v-model="selectedChat" :chats="filteredChats"/>
  </UDashboardPanel>

  <ChatBody
    v-if="selectedChat"
    :issue="selectedChat"
    @close="selectedChat = null"
  />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed"/>
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <ChatBody
          v-if="selectedChat"
          :issue="selectedChat"
          @close="selectedChat = null"
        />
      </template>
    </USlideover>
  </ClientOnly>
</template>
