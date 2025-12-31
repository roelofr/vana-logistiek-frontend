<script setup lang="ts">
import { format } from 'date-fns'
import type { Thread } from '~/types'
import type { UIMessage } from 'ai'
import { expand } from '~/utils'
import { UTextarea } from '#components'

const { $api } = useNuxtApp()

const { thread } = defineProps<{ thread: Thread }>()

const emits = defineEmits(['close'])

const dropdownItems = [[{
  label: 'Mark as unread',
  icon: 'i-lucide-check-circle',
}, {
  label: 'Mark as important',
  icon: 'i-lucide-triangle-alert',
}], [{
  label: 'Star thread',
  icon: 'i-lucide-star',
}, {
  label: 'Mute thread',
  icon: 'i-lucide-circle-pause',
}]]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

const {
  data: updates,
  status: updatesStatus,
  refresh: updatesRefresh,
} = useApi<UIMessage[]>(() => `/api/threads/${thread.id}/updates`, {
  lazy: true,
  watch: [thread],
})

const updatesExpanded = computed(() => expand(updates.value, ['user', 'team']))

watch(() => thread, () => {
  reply.value = ''
  loading.value = false
}, {
  immediate: false,
})

async function sendMessage() {
  try {
    loading.value = true

    await $api(`/api/threads/${thread.id}/message`, {
      method: 'post',
      body: {
        message: reply.value,
      },
    })

    toast.add({
      color: 'success',
      title: 'Opgeslagen',
    })

    reply.value = ''
    updatesRefresh()
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

const replyField = useTemplateRef<UTextarea>('reply-field')

defineShortcuts({
  meta_enter: {
    usingInput: 'reply-field',
    handler: async () => {
      await sendMessage()
      replyField.value.focus()
    },
  },
})
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="thread.subject" :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton
            icon="i-lucide-inbox"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton icon="i-lucide-reply" color="neutral" variant="ghost" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            {{ thread.vendor.name }}
          </p>
          <div class="text-muted flex flex-row items-center gap-2">
            <VendorNumber :vendor="thread.vendor" />
            <p>{{ thread.vendor.district.name }}</p>
          </div>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        {{ format(new Date(thread.createdAt), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6">
      <ThreadsThreadUpdates v-if="updatesStatus == 'success'" :updates="updatesExpanded" />
      <UAlert
        v-else-if="updatesStatus == 'error'"
        color="error"
        variant="soft"
        title="Laden mislukt"
        description="De berichten konden niet worden geladen, probeer het later opnieuw."
        icon="i-lucide-triangle-alert"
      />
      <div
        v-else
        class="my-4 flex flex-row items-center justify-center gap-2 text-dimmed"
      >
        <UIcon name="i-lucide-loader" class="animate-spin" size="20" />
        <span>Berichten worden opgehaald...</span>
      </div>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard variant="subtle" class="mt-auto" :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }">
        <template #header>
          <UIcon name="i-lucide-reply" class="size-5" />

          <span class="text-sm truncate">
            Reageren op deze melding
          </span>
        </template>

        <form @submit.prevent="sendMessage">
          <UTextarea
            ref="reply-field"
            v-model="reply"
            name="reply-field"
            color="neutral"
            variant="none"
            required
            autoresize
            :rows="1"
            placeholder="Typ een gevatte reactie, of wat doms..."
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 pb-4 resize-none' }"
          />

          <div class="flex items-center justify-between">
            <UTooltip text="Attach file">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-paperclip"
              />
            </UTooltip>

            <div class="flex items-center justify-end gap-2">
              <UButton
                type="submit"
                color="neutral"
                :loading="loading"
                label="Versturen"
                icon="i-lucide-send"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
