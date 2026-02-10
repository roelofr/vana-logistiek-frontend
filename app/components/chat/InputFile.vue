<script lang="ts" setup>
const { file } = defineProps<{ file: File }>()
const emit = defineEmits<{ remove: [] }>()

const thumbnail = ref<string | null>(null)

const avatar = computed(() => {
  if (thumbnail.value)
    return { src: thumbnail.value }
  return { icon: 'i-lucide-paperclip' }
})

onMounted(async () => {
  if (!file)
    return

  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
    resizeHeight: 64,
    resizeWidth: 64,
    resizeQuality: 'medium',
  })

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const renderer = canvas.getContext('bitmaprenderer')
  renderer?.transferFromImageBitmap(bitmap)

  const blob = await canvas.convertToBlob({ type: 'image/webp' })
  thumbnail.value = URL.createObjectURL(blob).toString()
})
</script>

<template>
  <UButton
    :avatar="avatar"
    color="neutral"
    size="lg"
    variant="outline"
    @click="emit('remove')"
  />
</template>
