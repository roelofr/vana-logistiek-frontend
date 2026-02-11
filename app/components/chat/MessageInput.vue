<script lang="ts" setup>
const { disabled } = defineProps<{ disabled: boolean }>()
const emit = defineEmits<{ send: [string, FileList] }>()

const { files, open: fileOpen, reset: fileReset } = useFileDialog({
  accept: 'image/*',
  directory: false,
})

const reply = ref('')

function reset() {
  reply.value = ''
  fileReset()
}

defineExpose({ reset })

async function sendMessage() {
  if (disabled)
    return

  emit('send', reply.value, (files.value ?? []) as FileList)
}

function addFiles() {
  const initialFiles = files.value
  fileOpen({
    initialFiles: initialFiles ?? [],
    multiple: true,
  })
}

defineShortcuts({
  meta_enter: {
    usingInput: 'reply-field',
    handler: sendMessage,
  },
})
</script>

<template>
  <form @submit.prevent="sendMessage">
    <div class="flex flex-col flex-wrap" />
    <UTextarea
      ref="reply-field"
      v-model="reply"
      :disabled="disabled"
      :rows="1"
      :ui="{ base: 'p-0 pb-4 resize-none' }"
      autoresize
      class="w-full"
      color="neutral"
      name="reply-field"
      placeholder="Typ een gevatte reactie, of wat doms..."
      required
      variant="none"
    />

    <div class="flex items-center justify-between">
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <template v-if="files != null">
          <ChatInputFile
            v-for="file of files"
            :key="file.name"
            :file="file"
          />

          <UTooltip text="Bijlage toevoegen">
            <UButton
              size="xl"
              color="neutral"
              icon="i-lucide-plus"
              variant="ghost"
              @click="addFiles"
            />
          </UTooltip>
        </template>

        <UTooltip v-else text="Bijlage toevoegen">
          <UButton
            color="neutral"
            leading-icon="i-lucide-paperclip"
            variant="ghost"
            @click="addFiles"
          >
            Foto's bijvoegen
          </UButton>
        </UTooltip>
      </div>

      <div class="flex items-center justify-end gap-2 flex-none">
        <UButton
          :disabled="disabled"
          color="neutral"
          icon="i-lucide-send"
          label="Versturen"
          type="submit"
        />
      </div>
    </div>
  </form>
</template>
