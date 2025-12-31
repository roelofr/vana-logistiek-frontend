<script lang="ts" setup>
</script>

<template>
  <UDashboardPanel id="inbox-empty">
    <div class="h-full grow flex flex-col items-center justify-center">
      <UEmpty
        :actions="[{
          label: 'Melding aanmaken',
          icon: 'i-lucide-plus',
          color: 'primary',
        }]"
        description="Selecteer een melding uit de mail lijst, of maak een nieuwe melding aan."
        title="Geen melding geselecteerd"
        variant="naked"
      >
        <template #leading>
          <UIcon name="i-lucide-inbox" />
        </template>
      </UEmpty>
    </div>
  </UDashboardPanel>
</template>
