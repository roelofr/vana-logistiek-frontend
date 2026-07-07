<script setup lang="ts">
const { id } = defineProps<{ id: number }>();

const isLoading = ref(false);

async function sendChatReply(message: string | null, files: FileList) {
  isLoading.value = true;

  const formData = new FormData();
  if (message) formData.set("message", message);
  if (files?.length > 0)
    Array.from(files).forEach((file) => formData.append("file", file));

  try {
    const response = await $fetch<Message[]>(`/api/chats/by-id/${id}/entries`, {
      method: "POST",
      body: formData,
    });

    if (response) emit("update", response);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <ChatMessageInput :disabled="isLoading" @reply="sendChatReply" />
</template>

<style scoped></style>
