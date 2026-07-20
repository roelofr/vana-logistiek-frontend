<script lang="ts" setup>
import type { District } from "~/types";

const { district, size = undefined } = defineProps<{
  district: Partial<District>;
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

const colourComputed = computed(() => district.colour ?? "pink");
</script>

<template>
  <UAvatar
    :alt="district.name"
    icon="i-lucide-land-plot"
    :size="size"
    :class="`bg-${colourComputed}-700 dark:bg-${colourComputed}-500`"
    :style="{
      '--ui-text-muted': 'var(--ui-text-inverted)',
    }"
  />
</template>
