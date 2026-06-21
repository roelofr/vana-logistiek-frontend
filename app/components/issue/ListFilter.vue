<script setup lang="ts">
const selectedTab = defineModel<string>("all");

const tabItems = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
];
</script>

<template>
  <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
</template>
