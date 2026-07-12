<script lang="ts" setup>
import type { Group } from "~/types";
import { toLucideIcon } from "~/utils/string-util";

const { group, size = undefined } = defineProps<{
  group: Partial<Group>;
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
}>();

const colourComputed = computed(() => group.colour ?? "pink");
const iconComputed = computed(() =>
  group.icon ? toLucideIcon(group.icon) : undefined,
);
</script>

<template>
  <UAvatar
    :alt="group.name"
    :icon="iconComputed"
    :size="size"
    :class="`bg-${colourComputed}-700 dark:bg-${colourComputed}-500`"
    :style="{
      '--ui-text-muted': 'var(--ui-text-inverted)',
    }"
  />
</template>
