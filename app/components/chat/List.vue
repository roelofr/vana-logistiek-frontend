<script setup lang="ts">
import { localTime, locationToGrid } from "#imports";
import type { Chat } from "~/types";

const { chats, loading } = defineProps<{
  chats: Chat[];
  loading: boolean;
}>();

const skeletonRows = Array(20)
  .fill(null)
  .map((_, index) => index);

const issuesRefs = ref<Record<number, Element | null>>({});

const selectedChat = defineModel<Chat | undefined>();

watch(selectedChat, (newValue) => {
  if (!newValue) return;

  issuesRefs.value[newValue.id]?.scrollIntoView({ block: "nearest" });
});

defineShortcuts({
  arrowdown: () => {
    const index = chats.findIndex(
      (chat: Chat) => chat.id === selectedChat.value?.id,
    );

    if (index === -1) {
      selectedChat.value = chats[0];
    } else if (index < chats.length - 1) {
      selectedChat.value = chats[index + 1];
    }
  },
  arrowup: () => {
    const index = chats.findIndex(
      (chat: Chat) => chat.id === selectedChat.value?.id,
    );

    if (index === -1) {
      selectedChat.value = chats[chats.length - 1];
    } else if (index > 0) {
      selectedChat.value = chats[index - 1];
    }
  },
});
</script>

<template>
  <div
    class="divide-y divide-default"
    :class="loading ? 'overflow-y-hidden' : 'overflow-y-auto'"
  >
    <template v-if="loading">
      <div v-for="row in skeletonRows" :key="row">
        <div
          class="block p-4 sm:pr-6 text-sm cursor-pointer border-l-2 border-bg"
        >
          <div class="grid grid-message max-w-full gap-4">
            <UAvatarGroup>
              <USkeleton class="rounded-full h-12 w-12" />
            </UAvatarGroup>

            <div class="grid">
              <div class="flex items-center justify-between">
                <USkeleton class="h-4 w-8/12" />

                <USkeleton class="h-4 w-16" />
              </div>

              <div class="flex items-center gap-4">
                <USkeleton class="h-4 w-4" />
                <USkeleton class="h-3 w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="!chats?.length" class="p-4">
      <UEmpty
        icon="i-lucide-inbox"
        title="Geen meldingen"
        description="Het lijkt er op dat er nog geen meldingen zijn binnengekomen, of je hebt ze allemaal weggefilterd."
      />
    </div>
    <div
      v-for="(chat, index) in chats"
      v-else
      :key="index"
      :ref="
        (el) => {
          issuesRefs[chat.id] = el as Element | null;
        }
      "
    >
      <NuxtLink
        as="div"
        class="block p-4 sm:pr-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          chat.unread ? 'text-highlighted' : 'text-toned',
          selectedChat && selectedChat.id === chat.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        :to="`/chats/${chat.id}`"
        @click="selectedChat = chat"
      >
        <div class="grid grid-message max-w-full gap-4">
          <ChatAvatars :chat="chat" size="lg" />
          <div class="grid">
            <div
              class="flex items-center justify-between"
              :class="{ 'font-semibold': chat.unread }"
            >
              <div class="flex items-center gap-3">
                {{ chat.title }}

                <UChip v-if="chat.unread" />
              </div>

              <span>{{ localTime(chat.updatedAt) }}</span>
            </div>
            <div class="flex gap-2">
              <p
                class="truncate max-w-full text-dimmed line-clamp-1 flex items-center gap-2 grow"
              >
                <template v-if="chat.subject && chat.subject.vendor">
                  <UIcon
                    :name="toLucideIcon(chat.subject.vendor.icon)"
                    class="h-4"
                  />
                  <span>{{ chat.subject.vendor.name }}</span>
                  <span>({{ chat.subject.vendor.number }})</span>
                </template>
                <template v-else-if="chat.subject && chat.subject.location">
                  <UIcon name="i-lucide-pin" class="h-4" />
                  <span>{{ locationToGrid(chat.subject.location) }}</span>
                </template>
                <template v-else>{{ getChatParticipants(chat) }}</template>
              </p>

              <div class="flex-none">
                <UBadge
                  v-if="chat.subject?.resolvedAt"
                  variant="outline"
                  size="xs"
                  color="success"
                  icon="i-lucide-check"
                  aria-label="Opgelost"
                />
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.grid-message {
  grid-template-columns: min-content 1fr;
}
</style>
