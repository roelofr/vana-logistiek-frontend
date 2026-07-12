<script setup lang="ts">
import { localTime } from "#imports";

const props = defineProps<{
  chats: ListChat[];
}>();

const issuesRefs = ref<Record<number, Element | null>>({});

const selectedChat = defineModel<ListChat | undefined>();

watch(selectedChat, (newValue) => {
  if (!newValue) return;

  issuesRefs.value[newValue.id]?.scrollIntoView({ block: "nearest" });
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

const numberOfAvatars = 2;

const chatUserAvatars = (chat: ListChat) => {
  if (chat.users && chat.users.length > numberOfAvatars)
    return chat.users.slice(0, numberOfAvatars);
  if (chat.users) return chat.users;
};

const chatGroupAvatars = (chat: ListChat) => {
  if (!chat.groups) return [];

  const numberOfGroups = numberOfAvatars - (chat.users?.length ?? 0);
  if (numberOfGroups <= 0) return [];

  if (chat.groups.length > numberOfGroups)
    return chat.groups.slice(0, numberOfGroups);
  return chat.groups;
};

const chatAvatars = (chat: ListChat) => {
  return [...chat.users, ...chat.groups].slice(0, 2).map((user) => ({
    alt: user.name,
    src: (user as unknown as Record<string, string | null>).avatar ?? undefined,
    icon: (user as unknown as Record<string, string | null>).icon ?? undefined,
    color:
      (user as unknown as Record<string, string | null>).colour ?? undefined,
  }));
};
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
          <UAvatarGroup size="lg">
            <UserAvatar
              v-for="user in chatUserAvatars(chat)"
              :key="user.id"
              :user="user"
              single
            />
            <GroupAvatar
              v-for="group in chatGroupAvatars(chat)"
              :key="group.id"
              :group="group"
            />
          </UAvatarGroup>
          <div class="grid">
            <div
              class="flex items-center justify-between"
              :class="{ 'font-semibold': chat.unread }"
            >
              <div class="flex items-center gap-3">
                {{ chat.title }}

                <UChip v-if="chat.unread" />

                <UBadge
                  v-if="chat.subject?.resolvedAt"
                  variant="outline"
                  size="xs"
                  color="success"
                  icon="i-lucide-check"
                  aria-label="Opgelost"
                />
              </div>

              <span>{{ localTime(chat.updatedAt) }}</span>
            </div>
            <p class="truncate max-w-full text-dimmed line-clamp-1">
              <template v-if="chat.subject && chat.subject.vendor">
                {{ chat.subject.vendor.name }} ({{
                  chat.subject.vendor.number
                }})
              </template>
              <template v-else-if="chat.subject && chat.subject.location">
                Op locatie
              </template>
              <template v-else> Reguliere chat</template>
            </p>
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
