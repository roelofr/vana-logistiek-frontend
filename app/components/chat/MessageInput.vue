<script lang="ts" setup>
import { object, array, string } from "yup";
import type { Chat, ChatEntry } from "~/types";

const { chat, disabled = false } = defineProps<{
  chat: Chat;
  disabled?: boolean;
}>();
const emit = defineEmits<{ send: [ChatEntry[]] }>();

const formState = reactive({
  message: "",
  files: [] as File[],
});

const {
  files,
  open: fileOpen,
  reset: fileReset,
  onChange: onFileChange,
} = useFileDialog({
  accept: "image/*",
  directory: false,
});

onFileChange((files) => {
  if (files) formState.files = [...formState.files, ...Array.from(files)];
});

function reset() {
  formState.files = [];
  formState.message = "";
  fileReset();
}

defineExpose({ reset });

const isLoading = ref(false);
async function sendMessage() {
  if (disabled || isLoading.value) return;
  isLoading.value = true;

  const data = new FormData();
  data.append("message", formState.message);
  if (formState.files)
    for (const file of formState.files) data.append("files", file);

  try {
    const response = await $fetch<ChatEntry[]>(
      `/api/chats/by-id/${chat.id}/entries`,
      {
        method: "POST",
        body: data,
      },
    );

    if (response) emit("send", response);

    reset();
  } finally {
    isLoading.value = false;
  }
}

function addFiles() {
  console.log("Adding from %o", files.value);
  fileOpen({
    initialFiles: files.value ?? undefined,
    multiple: true,
  });
}

function removeFile(file: File) {
  formState.files = formState.files.filter((f) => f !== file);
}

defineShortcuts({
  meta_enter: {
    usingInput: "reply-field",
    handler: sendMessage,
  },
});
</script>

<template>
  <UForm
    :disabled="isLoading"
    class="p-4 grid grid-cols-1 gap-4"
    @submit.prevent="sendMessage"
  >
    <UTextarea
      ref="reply-field"
      v-model="formState.message"
      :disabled="disabled"
      :rows="1"
      autoresize
      class="w-full"
      size="xl"
      :ui="{ root: 'max-w-full', base: 'w-full' }"
      color="neutral"
      name="reply-field"
      placeholder="Typ een gevatte reactie, of wat doms..."
      variant="outline"
    />

    <div class="flex items-center justify-between">
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <template v-if="formState.files.length > 0">
          <ChatInputFile
            v-for="file of formState.files"
            :key="file.name"
            :file="file"
            @remove-file="removeFile"
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
          :loading="isLoading"
          color="neutral"
          icon="i-lucide-send"
          label="Versturen"
          type="submit"
        />
      </div>
    </div>
  </UForm>
</template>
