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
const colourComputed = computed(() => groupComputed.value?.colour ?? "pink");
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
    <UAvatar
      v-if="groupComputed"
      :class="`bg-${colourComputed}-700 dark:bg-${colourComputed}-500`"
      :style="{
        '--ui-text-muted': 'var(--ui-text-inverted)',
      }"
      :icon="groupComputed.icon"
      :alt="groupComputed.name"
      :size="size"
    />
  </UAvatarGroup>
</template>
