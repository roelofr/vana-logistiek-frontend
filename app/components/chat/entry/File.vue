<script setup lang="ts">
import type { ChatFile } from "~/types";

const { entry } = defineProps<{ entry: ChatFile }>();
</script>

<template>
  <UEmpty
    v-if="entry.fileStatus === 'new'"
    class="border border-muted rounded p-2"
    icon="i-lucide-file"
    description="Bijlage verwerken..."
  />
  <UEmpty
    v-if="entry.fileStatus === 'corrupted'"
    class="border border-muted rounded p-2"
    icon="i-lucide-file-x"
    description="Bijlage beschadigd"
  />
  <img
    v-else-if="entry.fileType == 'image'"
    class="bg-muted rounded max-w-[80%] max-h-[300px]"
    :src="entry.url"
  />
  <UButton
    v-else-if="entry.fileType == 'binary'"
    :to="entry.url"
    target="_blank"
    variant="outline"
    class="text-primary"
  >
    <UUser
      :avatar="{ icon: 'i-lucide-file' }"
      :name="entry.filename"
      :description="entry.mimetype"
    />
  </UButton>
  <UEmpty
    v-else
    class="border border-muted rounded p-2"
    icon="i-lucide-file-question-mark"
    description="Onbekende bijlage"
  />
</template>

<style scoped></style>
