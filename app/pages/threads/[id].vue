<script setup lang="ts">
import type { Thread } from '../../types'

const NUMBERS_ONLY = /^[1-9][0-9]*$/

definePageMeta({
  validate({ params }) {
    return typeof params.id === 'string' && NUMBERS_ONLY.test(params.id)
  },
  keepalive: {
    max: 5,
  },
})

const threadId = computed(() => useRoute().params.id as string)

const ticketStore = useTicketStore()
onMounted(() => ticketStore.setActiveTicket(Number.parseInt(threadId.value, 10)))

const closeAction = () => ticketStore.setActiveTicket(null)

const {
  data: thread,
  status,
  refresh,
} = useApi<Thread>(() => `/api/threads/${threadId.value}`, { lazy: true })
</script>

<template>
  <UDashboardPanel v-if="status === 'error'" id="inbox-2">
    <UDashboardNavbar :title="`Melding ${threadId}`" :toggle="false">
      <template #leading>
        <UButton
          class="-ms-1.5"
          color="neutral"
          icon="i-lucide-x"
          variant="ghost"
          @click="closeAction()"
        />
      </template>
    </UDashboardNavbar>

    <div class="p-4 sm:p-6">
      <UAlert
        variant="soft"
        title="Laden van melding mislukt"
        description="De melding kon niet worden geladen"
        :actions="[
          {
            label: 'Herladen',
            icon: 'i-lucide-rotate-ccw',
            onClick: () => refresh(),
          },
        ]"
      />
    </div>
  </UDashboardPanel>

  <ThreadsViewMessageLoading
    v-else-if="status !== 'success'"
    :thread-id="threadId"
    @close="closeAction()"
  />
  <ThreadsViewMessage v-else-if="thread" :thread="thread" @close="closeAction()" />
</template>
