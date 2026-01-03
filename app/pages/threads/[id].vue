<script setup lang="ts">
import type { Thread, ThreadUpdate } from '~/types'
import { format } from 'date-fns'
import { expand } from '~/utils'
import { UTextarea } from '#components'

definePageMeta({
  name: 'threads-id',
  props: ['id'],
  validate({ params }) {
    if (!params.id || !String(params.id).match(/^[1-9]\d{0,4}$/)) {
      console.warn('Route /threads/:id was non-numeric.')
      return false
    }

    return true
  },
})

const props = defineProps<{ id: number }>()
const { $api } = useNuxtApp()
const toast = useToast()

const emits = defineEmits(['close'])

const reply = ref('')
const loading = ref(false)

const { data: thread } = useApi<Thread>(() => `/api/threads/${props.id}`, {
  watch: [props],
})

const {
  data: updates,
  status: updatesStatus,
  refresh: updatesRefresh,
} = useApi<ThreadUpdate[]>(() => `/api/threads/${props.id}/updates`, {
  watch: [props],
})

const updatesExpanded = computed(() => expand(updates.value, ['user', 'team']))

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

watch(() => props.id, () => {
  reply.value = ''
  loading.value = false
}, {
  immediate: false,
})

async function sendMessage() {
  try {
    loading.value = true

    await $api(`/api/threads/${props.id}/message`, {
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
    await updatesRefresh()
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
  <UDashboardPanel v-if="thread == undefined">
    <template #body>
      <div class="p-8 flex items-center">
        <UIcon name="i-lucide-spinner" size="32" class="animate-spin" />
        <span>Bericht wordt geladen...</span>
      </div>
    </template>
  </UDashboardPanel>
  <UDashboardPanel v-else id="inbox-2">
    <UDashboardNavbar :title="`Melding ${thread.id}`" :toggle="false">
      <template #leading>
        <UButton
          class="-ms-1.5"
          color="neutral"
          icon="i-lucide-x"
          variant="ghost"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton
            color="neutral"
            icon="i-lucide-inbox"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton color="neutral" icon="i-lucide-reply" variant="ghost" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton
            color="neutral"
            icon="i-lucide-ellipsis-vertical"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="p-4 sm:px-6 border-b border-default">
      <h1 class="font-semibold text-lg">
        {{ thread.subject }}
      </h1>
    </div>

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

      <p class="text-muted text-sm sm:mt-2">
        {{ format(new Date(thread.createdAt), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6">
      <ThreadsThreadUpdates v-if="updatesStatus == 'success'" :updates="updatesExpanded" />
      <UAlert
        v-else-if="updatesStatus == 'error'"
        color="error"
        description="De berichten konden niet worden geladen, probeer het later opnieuw."
        icon="i-lucide-triangle-alert"
        title="Laden mislukt"
        variant="soft"
      />
      <div
        v-else
        class="my-4 flex flex-row items-center justify-center gap-2 text-dimmed"
      >
        <UIcon class="animate-spin" name="i-lucide-loader" size="20" />
        <span>Berichten worden opgehaald...</span>
      </div>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }" class="mt-auto" variant="subtle">
        <template #header>
          <UIcon class="size-5" name="i-lucide-reply" />

          <span class="text-sm truncate">
            Reageren op deze melding
          </span>
        </template>

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
      </UCard>
    </div>
  </UDashboardPanel>
</template>
