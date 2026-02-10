<script lang="ts" setup>
import type { Thread } from '~/types'
import type { TabsItem } from '@nuxt/ui/components/Tabs.vue'
import ReplyToMessage from '~/components/threads/ReplyToMessage.vue'

const actions: TabsItem[] = [
  { icon: 'i-lucide-reply', label: 'Reageren' },
  { icon: 'i-lucide-settings', label: 'Acties' },
]

const { thread } = defineProps<{ thread: Thread }>()

const emit = defineEmits<{ update: [] }>()

const { $api } = useNuxtApp()
const toast = useToast()

const reply = ref('')
const loading = ref(false)
const fileList = ref([])

async function sendMessage() {
  if (loading.value)
    return

  try {
    loading.value = true

    await $api(`/api/threads/${thread.id}/message`, {
      method: 'post',
      body: {
        message: reply.value,
        files: fileList,
      },
    })

    toast.add({
      color: 'success',
      title: 'Opgeslagen',
    })

    reply.value = ''
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

defineShortcuts({
  meta_enter: {
    usingInput: 'reply-field',
    handler: sendMessage,
  },
})
</script>

<template>
  <div class="rounded-lg overflow-hidden mt-auto bg-elevated/50 ring ring-default divide-y divide-default">
    <UTabs
      :content="false"
      :items="actions"
      class="w-full"
      color="neutral"
      variant="link"
    />

    <div class="p-4 sm:p-6">
      <ReplyToMessage :thread="thread" @update="emit('update')" />
    </div>
  </div>
</template>
