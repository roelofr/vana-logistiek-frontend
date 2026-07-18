<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

const model = defineModel();

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <UDrawer v-if="isMobile" title="Filter chats" close>
    <UButton label="Filter" size="sm" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"/>

    <template #body>
      <ChatListFilter v-model="model"/>
    </template>
  </UDrawer>

  <UPopover v-else>
    <UButton label="Filter" size="sm" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"/>

    <template #content>
      <ChatListFilter v-model="model"/>
    </template>
  </UPopover>
</template>

<style scoped>

</style>
