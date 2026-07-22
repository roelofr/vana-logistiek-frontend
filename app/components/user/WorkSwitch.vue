<script setup lang="ts">
defineComponent({
  inheritAttrs: false,
});

const { compact = false, showHelp = true } = defineProps<{
  compact?: boolean;
  showHelp?: boolean;
}>();

const workState = useWorkState();

const isAtWork = computed({
  get: () => workState.isAtWork.value,
  set: (value: boolean) => workState.setWorkStatus(value),
});
</script>

<template>
  <div class="flex items-center justify-between" :class="$attrs.class">
    <USwitch
      v-model="isAtWork"
      :loading="workState.isLoading.value"
      :description="compact ? undefined : `Aan het werk`"
      checked-icon="i-lucide-pickaxe"
      unchecked-icon="i-lucide-parasol"
    />

    <UTooltip
      v-if="showHelp && !compact"
      :delay-duration="0"
      text="Opgeslagen als “Ja” of “Nee”, niks meer"
    >
      <UButton
        size="sm"
        color="neutral"
        class="rounded-full"
        variant="soft"
        icon="i-lucide-info"
      />
    </UTooltip>
  </div>
</template>

<style scoped></style>
