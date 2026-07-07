<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

useHead({title: 'Chat'})
</script>
<template>
  <div class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed"/>
  </div>
</template>
