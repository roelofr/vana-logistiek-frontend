<script setup lang="ts">
import type {Chat} from "~/types";
import MessageList from "~/components/chat/MessageList.vue";
import { computed } from "@vue/reactivity";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

// Fetches new data every time you switch messages
const {data: chat} = await useFetch<Chat>(
  () => `/api/chats/by-id/${route.params.id}`
);

const messageTitle = computed(() => chat.value?.title ?? 'Chat')

useHead({
  title: computed(() => chat.value?.title ? `${chat.value!.title} - Bekijk Chat` : `Bekijk Chat`)
})

function leaveMessage() {
  router.push('/inbox')
}
</script>

<template>
  <UDashboardPanel v-if="!chat" class="flex align-center justify-center">
    <UEmpty icon="i-lucide-circle-x" title="Bericht niet gevonden" description="Het bericht dat u zoekt bestaat niet."/>
  </UDashboardPanel>
  <UDashboardPanel v-else>
    <template #header>
      <UDashboardNavbar :title="messageTitle">
        <template #leading>
          <UButton
            icon="i-lucide-x"
            aria-label="Sluit bericht"
            variant="ghost"
            color="neutral"
            @click="leaveMessage()"/>
        </template>
      </UDashboardNavbar>

      <ChatHeader :chat="chat!"/>
    </template>

    <template #body>
      <ChatMessageList :chat="chat!"/>
    </template>
    <template #footer>
      <ChatMessageInput :chat="chat!" />
    </template>
  </UDashboardPanel>
</template>
