<script setup lang="ts">
const confetti = useConfetti();
</script>

<template>
  <UEmpty
    variant="soft"
    title="Instellingen niet beschikbaar"
    description="Deze instellingen-pagina is nog niet beschikbaar"
    icon="i-lucide-construction"
    :actions="[
      {
        label: 'Janken',
        onClick: () => confetti.dispatch('sad'),
      },
    ]"
  />
</template>

<style scoped></style>
