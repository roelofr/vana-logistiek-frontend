<script setup lang="ts">
const selectedTab = defineModel<string>("active");

const tabItems = [
  {
    label: "Actief",
    value: "active",
  },
  {
    label: "Alle",
    value: "all",
  },
];
</script>

<template>
  <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
</template>
