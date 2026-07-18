<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const model = defineModel<string>();
const { label, items, defaultValue } = defineProps<{
  label: string;
  items: SelectItem[];
  defaultValue: string;
}>();

const isActive = computed(() => model.value !== defaultValue);
</script>

<template>
  <UFormField :hint="isActive ? 'Actief' : undefined" :label="label">
    <USelect
      v-model="model"
      :items="items"
      :ui="{ content: 'min-w-fit' }"
      class="w-full"
      size="sm"
      value-key="value"
    />
  </UFormField>
</template>

<style scoped></style>
