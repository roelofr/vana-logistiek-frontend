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
      :label="compact ? undefined : `Aan het werk`"
      checked-icon="i-lucide-pickaxe"
      unchecked-icon="i-lucide-parasol"
    />
  </div>
</template>

<style scoped></style>
