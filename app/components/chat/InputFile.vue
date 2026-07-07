<script lang="ts" setup>
import type { AvatarProps } from "#ui/components/Avatar.vue";

const { file } = defineProps<{ file: File }>();
const emit = defineEmits<{ removeFile: [File] }>();

const thumbnail = ref<string | null>(null);

const avatar = computed(
  () =>
    ({
      ...(thumbnail.value
        ? { src: thumbnail.value }
        : { icon: "i-lucide-paperclip" }),
      ui: {
        root: "rounded-sm",
      },
    }) as AvatarProps,
);

onMounted(async () => {
  if (!file) return;

  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
    resizeHeight: 256,
    resizeWidth: 256,
    resizeQuality: "medium",
  });

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const renderer = canvas.getContext("bitmaprenderer");
  renderer?.transferFromImageBitmap(bitmap);

  const blob = await canvas.convertToBlob({ type: "image/webp" });
  thumbnail.value = URL.createObjectURL(blob).toString();
});

onUnmounted(() => {
  if (thumbnail.value) URL.revokeObjectURL(thumbnail.value);
});

function doDelete() {
  console.log("Delete file");
  emit("removeFile", file);
}
</script>

<template>
  <UPopover arrow>
    <UButton :avatar="avatar" color="neutral" size="xl" variant="outline" />

    <template #content>
      <div class="p-4">
        <UButton color="error" icon="i-lucide-x" @click="doDelete()"
          >Verwijder</UButton
        >
      </div>
    </template>
  </UPopover>
</template>
