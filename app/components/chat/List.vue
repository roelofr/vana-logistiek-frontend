<script setup lang="ts">
import {format, isToday} from "date-fns";
import type {Chat, Group, User} from "~/types";
import type {AvatarProps} from "#ui/components/Avatar.vue";

const props = defineProps<{
  chats: ListChat[];
}>();

const issuesRefs = ref<Record<number, Element | null>>({});

const selectedChat = defineModel<ListChat | null>();

watch(selectedChat, () => {
  if (!selectedChat.value) {
    return;
  }
  const ref = issuesRefs.value[selectedChat.value.id];
  if (ref) {
    ref.scrollIntoView({block: "nearest"});
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = props.chats.findIndex(
      (chat: ListChat) => chat.id === selectedChat.value?.id,
    );

    if (index === -1) {
      selectedChat.value = props.chats[0];
    } else if (index < props.chats.length - 1) {
      selectedChat.value = props.chats[index + 1];
    }
  },
  arrowup: () => {
    const index = props.chats.findIndex(
      (chat: ListChat) => chat.id === selectedChat.value?.id,
    );

    if (index === -1) {
      selectedChat.value = props.chats[props.chats.length - 1];
    } else if (index > 0) {
      selectedChat.value = props.chats[index - 1];
    }
  },
});

const formatDate = (date: Date) => {
  try {
    return isToday(date) ? format(date, "HH:mm") : format(date, "dd MMM HH:mm");
  } catch {
    return '';
  }
}

const userAvatar = (user: Pick<User, "name" | "avatar">): AvatarProps => {
  return {
    alt: user.name,
    src: user.avatar ?? undefined,
  }
}

const groupAvatar = (group: Pick<Group, "name" | "icon" | "colour">): AvatarProps => {
  return {
    icon: group.name,
    color: group.colour,
    alt: group.name,
  }
}

const chatAvatars = (chat: ListChat) => {
  if (chat.users?.length >= 2) {
    return [

    ]
  }
}

</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div v-if="!chats?.length" class="p-4">
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
      <div
        class="p-4 sm:pr-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          chat.unread ? 'text-highlighted' : 'text-toned',
          selectedChat && selectedChat.id === chat.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        @click="selectedChat = chat"
      >
        <div class="grid grid-message max-w-full gap-4">
          <UAvatar size="lg" alt="Tom Klaas"/>
          <div class="grid">
            <div
              class="flex items-center justify-between"
              :class="{ 'font-semibold': chat.unread }"
            >
              <div class="flex items-center gap-3">
                {{ chat.title }}

                <UChip v-if="chat.unread"/>
              </div>

              <span>{{ formatDate(chat.updatedAt) }}</span>
            </div>
            <p class="truncate max-w-full text-dimmed line-clamp-1">
              Lorem ipsum dolor sit amet, many more words that I don't get.
            </p>
          </div>
        </div>
      </div>
      <pre><code>{{ JSON.stringify(chat, undefined, 2 )}}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.grid-message {
  grid-template-columns: min-content 1fr;
}
</style>
