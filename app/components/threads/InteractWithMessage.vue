<script setup lang="ts">
import { UTextarea } from '#components'
import type { Thread } from '~/types'
import type { TabsItem } from '@nuxt/ui/components/Tabs.vue'

const actions: TabsItem[] = [
  { icon: 'i-lucide-reply', label: 'Reageren' },
  { icon: 'i-lucide-settings', label: 'Acties' },
]

const { thread } = defineProps<{
  thread: Thread
}>()

const emit = defineEmits<{
  update: []
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const reply = ref('')
const loading = ref(false)
const fileList = ref([])

watch(() => thread, () => {
  reply.value = ''
  loading.value = false
})

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
      color="neutral"
      variant="link"
      :content="false"
      :items="actions"
      class="w-full"
    />

    <div class="p-4 sm:p-6">
      <form @submit.prevent="sendMessage">
        <UTextarea
          ref="reply-field"
          v-model="reply"
          :disabled="loading"
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
          <UTooltip text="Attach file">
            <UButton
              color="neutral"
              icon="i-lucide-paperclip"
              variant="ghost"
            />
          </UTooltip>

          <div class="flex items-center justify-end gap-2">
            <UButton
              :loading="loading"
              color="neutral"
              icon="i-lucide-send"
              label="Versturen"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
