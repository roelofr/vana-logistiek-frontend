<script setup lang="ts">
import type { ChatMessage } from "~/types";

const { entry } = defineProps<{ entry: ChatMessage }>();
</script>

<template>
  <div class="bg-muted rounded p-2">
    {{ entry.message }}
  </div>
</template>

<style scoped></style>
