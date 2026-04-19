<script setup lang="ts">
const { chatId, showHeader = true } = defineProps<{
  chatId: number
  showHeader?: boolean
}>()
</script>

<template>
  <div>
    <ChatHeader v-if="showHeader" />
    <ChatMessages />
    <ChatReply />
  </div>
</template>

<style scoped>

</style>
