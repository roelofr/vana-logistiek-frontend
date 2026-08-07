<script setup lang="ts">
const { datetime } = defineProps<{ datetime: Date }>();

defineOptions({
  inheritAttrs: false,
});

const iso = datetime.toISOString();
const humanLong = localTime(datetime);
</script>

<template>
  <time :datetime="iso" class="text-dimmed" v-bind="$attrs">{{
    humanLong
  }}</time>
</template>

<style scoped></style>
