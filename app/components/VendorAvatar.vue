<script lang="ts" setup>
import type { Vendor } from "~/types";

const { vendor, size = undefined } = defineProps<{
  vendor: Vendor;
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

const colourComputed = computed(() => vendor?.colour ?? "zinc");
const iconComputed = computed(() => {
  const type = vendor?.type?.toLowerCase() ?? "shop";
  switch (type) {
    case "publisher":
      return "i-lucide-book-text";

    case "food":
      return "i-lucide-utensils";

    case "entertainment":
      return "i-lucide-flame-kindling";

    case "art":
      return "i-lucide-brush";

    default:
      return "i-lucide-store";
  }
});
</script>

<template>
  <UAvatar
    :class="`bg-${colourComputed}-700) dark:bg-${colourComputed}-500)`"
    :style="{
      '--ui-text-muted': 'var(--ui-text-inverted)',
    }"
    :icon="iconComputed"
    :alt="`${vendor.name} (${vendor.number})`"
    :size="size"
  />
</template>
