<script setup lang="ts">
import type { ChatFile } from "~/types";

const { entry } = defineProps<{ entry: ChatFile }>();
</script>

<template>
  <img
    v-if="entry.fileStatus == 'Ready'"
    class="bg-muted rounded max-w-[80%] max-h-[300px]"
    :src="entry.url"
  />
  <UEmpty
    v-else-if="entry.fileStatus === 'New'"
    class="border border-muted rounded p-2"
    icon="i-lucide-file"
    description="Bijlage verwerken..."
  />
  <UEmpty
    v-else
    class="border border-muted rounded p-2"
    icon="i-lucide-file-x"
    description="Bijlage beschadigd"
  />
</template>

<style scoped></style>
