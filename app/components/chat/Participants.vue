<script setup lang="ts">
import type { Chat, Group, User } from "~/types";

type ParticipantUser = Pick<User, "id" | "name" | "avatar"> & {
  atWork: boolean;
  viaGroup: null | Pick<Group, "id" | "name" | "icon" | "colour">;
};

const { chat } = defineProps<{ chat: Chat }>();

const open = ref(false);

const { data, execute, status } = useLazyFetch<ParticipantUser[]>(
  () => `/api/chats/by-id/${chat.id}/users`,
  { immediate: false },
);

watch(open, (newOpen) => {
  if (newOpen && status.value === "idle") execute();
});

const activeParticipants = computed<ParticipantUser[]>(
  () => data.value?.filter((user) => user.atWork) ?? [],
);
const idleParticipants = computed<ParticipantUser[]>(
  () => data.value?.filter((user) => !user.atWork) ?? [],
);
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      icon="i-lucide-users"
      color="neutral"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
    >
      Deelnemers
    </UButton>

    <template #content>
      <div class="p-4 grid grid-cols-1 gap-4">
        <div v-if="activeParticipants" class="gap-4 grid lg:grid-cols-2">
          <UUser
            v-for="user in activeParticipants"
            :key="user.id"
            :name="user.name"
            description="tbd"
          >
            <template #description>
              <p v-if="user.viaGroup">
                Via <GroupAvatar :group="user.viaGroup" />
                {{ user.viaGroup.name }}
              </p>
              <p v-else>Direct lid</p>
            </template>

            <template #avatar>
              <UChip inset>
                <UserAvatar single :user="user" />
              </UChip>
            </template>
          </UUser>
        </div>

        <div v-if="idleParticipants" class="gap-4 grid lg:grid-cols-2">
          <UUser
            v-for="user in idleParticipants"
            :key="user.id"
            :name="user.name"
            description="tbd"
          >
            <template #description>
              <p v-if="user.viaGroup">
                Via <GroupAvatar :group="user.viaGroup" />
                {{ user.viaGroup.name }}
              </p>
            </template>

            <template #avatar>
              <UserAvatar single :user="user" />
            </template>
          </UUser>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style scoped></style>
