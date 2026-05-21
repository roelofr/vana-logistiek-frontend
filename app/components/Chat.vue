<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const { chatId, showHeader = true } = defineProps<{
  chatId: number
  showHeader?: boolean
}>()

effect(() => console.info('Chat Id = %o', chatId))
</script>

<template>
  <div>
    <ChatHeader v-if="showHeader" />
    <ChatMessages />
    <ChatReply />
  </div>
</template>

<style scoped></style>
