<script setup lang="ts">
import type { Vendor } from '~/types'

const { vendor } = defineProps<{ vendor: Vendor | null }>()
</script>

<template>
  <UBadge v-if="vendor" variant="outline" color="neutral">
    {{ vendor.number }}
  </UBadge>
</template>
