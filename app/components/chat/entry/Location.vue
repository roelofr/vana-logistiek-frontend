<script setup lang="ts">
import type { ChatLocation } from "~/types";

const { entry } = defineProps<{ entry: ChatLocation }>();
</script>

<template>
  <MapView
    class="w-[80%] h-40"
    :interactive="false"
    :markers="[
      {
        name: '',
        lat: entry.latitude,
        lng: entry.longitude,
      },
    ]"
  />
</template>

<style scoped></style>
