<script setup lang="ts">
import type { Chat, ChatEntry } from "~/types";
import { computed } from "vue";
import type { ChatMessageList } from "#components";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const { refresh: refreshChats } = useChats();

const messageList =
  useTemplateRef<InstanceType<typeof ChatMessageList>>("messageList");

// Fetches new data every time you switch messages
const { data: chat, refresh: refreshChat } = await useFetch<Chat>(
  () => `/api/chats/by-id/${route.params.id}`,
);

const messageTitle = computed(() => chat.value?.title ?? "Chat");

useHead({
  title: computed(() =>
    chat.value?.title ? `${chat.value!.title} - Bekijk Chat` : `Bekijk Chat`,
  ),
});

function leaveMessage() {
  router.push("/chats");
}

function refreshData() {
  refreshChat(); // Refresh this chat
  refreshChats(); // Refresh chat list too
}

function refreshMessages() {
  messageList.value?.refresh();
}

function onChatAction() {
  refreshData();
  refreshMessages();
}

function onSendReply() {
  refreshMessages();
}

function onSystemMessage(_message: ChatEntry) {
  refreshData();
}
</script>

<template>
  <UDashboardPanel v-if="!chat" class="flex align-center justify-center">
    <UEmpty
      icon="i-lucide-circle-x"
      title="Bericht niet gevonden"
      description="Het bericht dat u zoekt bestaat niet."
    />
  </UDashboardPanel>
  <UDashboardPanel v-else>
    <template #header>
      <UDashboardNavbar :toggle="false" :title="messageTitle">
        <template v-if="chat.subject?.resolvedAt" #trailing>
          <UBadge
            variant="outline"
            color="success"
            icon="i-lucide-check"
            class="hidden lg:inline-flex"
          >
            Opgelost
          </UBadge>
          <UBadge
            variant="outline"
            color="success"
            icon="i-lucide-check"
            class="lg:hidden"
          />
        </template>
        <template #leading>
          <UButton
            icon="i-lucide-x"
            aria-label="Sluit bericht"
            variant="ghost"
            color="neutral"
            @click="leaveMessage()"
          />
        </template>

        <template #right>
          <ChatActions :chat="chat" @refresh="onChatAction()" />
        </template>
      </UDashboardNavbar>

      <ChatHeader :chat="chat!" />
    </template>

    <template #body>
      <ChatMessageList
        ref="messageList"
        :chat="chat!"
        @system-message="onSystemMessage($event)"
      />
    </template>
    <template #footer>
      <ChatMessageInput :chat="chat!" @send="onSendReply()" />
    </template>
  </UDashboardPanel>
</template>
