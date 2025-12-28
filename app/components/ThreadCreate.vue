<script setup lang="ts">
const emits = defineEmits(['close'])
</script>

<template>
  <UDashboardPanel id="inbox-empty">
    <UDashboardNavbar title="Nieuwe melding">
      <template #leading>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>
    </UDashboardNavbar>
    <div class="h-full grow flex flex-col items-center justify-center">
      <UEmpty
        title="Geen melding geselecteerd"
        description="Selecteer een melding uit de mail lijst, of maak een nieuwe melding aan."
        variant="naked"
        :actions="[{
          label: 'Melding aanmaken',
          icon: 'i-lucide-plus',
          color: 'primary',
        }]"
      >
        <template #leading>
          <UIcon icon="i-lucide-inbox" />
        </template>
      </UEmpty>
    </div>
  </UDashboardPanel>
</template>
