<script lang="ts" setup>
import type { Group, User } from "~/types";

const {
  user,
  group = undefined,
  size = undefined,
  single = false,
} = defineProps<{
  user: Partial<User>;
  group?: Partial<Group> | undefined;
  size?:
    | "md"
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | undefined;
  single?: boolean;
}>();

const groupComputed = computed<Partial<Group> | null>(
  () => group ?? user?.group ?? null,
);
</script>

<template>
  <template v-if="!user">
    <UAvatar icon="i-lucide-triangle-alert" color="error" :size="size" />
  </template>
  <template v-else-if="single">
    <UAvatar :src="user.avatar ?? undefined" :alt="user.name" :size="size" />
  </template>
  <UAvatarGroup v-else>
    <UAvatar :src="user.avatar ?? undefined" :alt="user.name" :size="size" />
    <GroupAvatar v-if="groupComputed" :group="groupComputed" :size="size" />
  </UAvatarGroup>
</template>
