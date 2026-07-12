<script setup lang="ts">
const skels = ["l", "r", "c", "r", "r", "l", "c", "r"];
</script>

<template>
  <div v-for="(side, index) in skels" :key="index" class="w-full mb-4">
    <div v-if="side == 'r'" class="flex justify-end gap-2">
      <USkeleton class="h-12 w-75" />
      <USkeleton class="size-8 rounded-full" />
    </div>
    <div v-else-if="side == 'l'" class="flex gap-2">
      <USkeleton class="size-8 rounded-full" />
      <USkeleton class="h-12 w-75" />
    </div>
    <USkeleton v-else class="h-6 w-80 mx-auto" />
  </div>
</template>

<style scoped></style>
