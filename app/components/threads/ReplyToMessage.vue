<script lang="ts" setup>
import type { Thread } from '~/types'

const emit = defineEmits<{ update: [] }>()
const { thread } = defineProps<{ thread: Thread }>()
const input = useTemplateRef('input')

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)

watch(() => thread, () => {
  loading.value = false
  input.value?.reset()
})

async function submitMessage(message: string, files: FileList) {
  if (loading.value)
    return

  try {
    loading.value = true

    const messageWithFiles = new FormData()
    messageWithFiles.set('message', message)
    if (files.length > 0)
      Array.from(files).forEach(file => messageWithFiles.append('file', file))

    await $api(`/api/threads/${thread.id}/message`, {
      method: 'post',
      body: messageWithFiles,
    })

    toast.add({
      color: 'success',
      title: 'Opgeslagen',
    })

    input.value?.reset()
    await emit('update')
  } catch (error) {
    console.error('Fout bij plaatsen comment: %o', error)
    toast.add({
      color: 'error',
      title: 'Toevoegen van opmerking mislukt!',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ChatMessageInput ref="input" :disabled="loading" @send="submitMessage" />
</template>
