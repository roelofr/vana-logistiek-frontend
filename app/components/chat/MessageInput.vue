<script lang="ts" setup>
import { object, string } from "yup";
import type { Chat } from "~/types";

const { chat, disabled } = defineProps<{ chat: Chat; disabled: boolean }>();
const emit = defineEmits<{ send: [string, FileList] }>();

const schema = object({
  message: string().when("files", {
    is: (files) => files?.length > 0,
    then: () => string().required("Je moet een reactie invullen"),
    otherwise: () => string().nullable(),
  }),
  files: object().nullable(),
});

const formState = reactive({
  message: "",
  files: null as FileList | null,
});

const {
  files,
  open: fileOpen,
  reset: fileReset,
  onChange: fileChange,
} = useFileDialog({
  accept: "image/*",
  directory: false,
});

fileChange((files) => (formState.files = files));

function reset() {
  formState.files = [];
  formState.message = "";
  fileReset();
}

defineExpose({ reset });

const isLoading = ref(false);
async function sendMessage() {
  if (disabled || isLoading.value) return;

  const data = new FormData();
  data.append("message", formState.message);
  if (formState.files)
    for (const file of formState.files) data.append("files", file);

  try {
    const response = await $fetch(`/api/chats/by-id/${chat.id}/entries`, {
      method: "POST",
      body: data,
    });

    console.log("Response = %o", response);

    if (response) emit("send", response);

    reset();
  } finally {
    isLoading.value = false;
  }
}

function addFiles() {
  const initialFiles = files.value;
  fileOpen({
    initialFiles: initialFiles ?? [],
    multiple: true,
  });
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
    :state="formState"
    :schema="schema"
    :disabled="isLoading"
    class="p-4 grid grid-cols-1 gap-2"
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
      required
      variant="outline"
    />

    <div class="flex items-center justify-between">
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <template v-if="formState.files != null">
          <ChatInputFile
            v-for="file of formState.files"
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
  </UForm>
</template>
