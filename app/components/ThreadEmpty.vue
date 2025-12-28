<script setup lang="ts">
</script>

<template>
  <UDashboardPanel id="inbox-empty">
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
          <UIcon name="i-lucide-inbox" />
        </template>
      </UEmpty>
    </div>
  </UDashboardPanel>
</template>
