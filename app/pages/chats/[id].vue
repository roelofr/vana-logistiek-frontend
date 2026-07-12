<script setup lang="ts">
import type { Chat } from "~/types";
import { computed } from "vue";
import type { ChatMessageList } from "#components";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

const messageList =
  useTemplateRef<InstanceType<typeof ChatMessageList>>("messageList");

// Fetches new data every time you switch messages
const { data: chat, refresh: chatRefresh } = await useFetch<Chat>(
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

function refresh() {
  messageList.value?.refresh();
  chatRefresh();
}

function onSendReply() {
  messageList.value?.refresh();
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
          <ChatActions :chat="chat" @refresh="refresh()"/>
        </template>
      </UDashboardNavbar>

      <ChatHeader :chat="chat!"/>
    </template>

    <template #body>
      <ChatMessageList ref="messageList" :chat="chat!"/>
    </template>
    <template #footer>
      <ChatMessageInput :chat="chat!" @send="onSendReply()"/>
    </template>
  </UDashboardPanel>
</template>
