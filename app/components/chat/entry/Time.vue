<script setup lang="ts">
const { datetime } = defineProps<{ datetime: Date }>();

defineOptions({
  inheritAttrs: false,
});
const iso = datetime.toISOString();
const human = useTimeAgoIntl(datetime);
const humanLong = localTime(datetime);
</script>

<template>
  <UTooltip :text="humanLong" :delay-duration="250">
    <time :datetime="iso" class="text-dimmed" v-bind="$attrs">{{ human }}</time>
  </UTooltip>
</template>

<style scoped></style>
