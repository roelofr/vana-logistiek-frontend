<script lang="ts" setup>
import type { Vendor } from '~/types'

const { vendor } = defineProps<{ vendor: Vendor | null }>()
</script>

<template>
  <UBadge v-if="vendor" color="neutral" variant="outline">
    {{ vendor.number }}
  </UBadge>
</template>
