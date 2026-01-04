<script setup lang="ts">
import type { Thread } from '~/types'

definePageMeta({
  name: 'threads-id',
  key: route => `thread-id-${route.params.id}`,
  validate({ params }) {
    if (!params.id || !String(params.id).match(/^[1-9]\d{0,4}$/)) {
      console.warn('Route /threads/:id was non-numeric.')
      return false
    }

    return true
  },
  keepalive: {
    max: 5,
  },
})

const emits = defineEmits<{
  close: []
}>()

const route = useRoute()
const threadId = computed(() => parseInt((route.params.id ?? '0') as string, 10))
const { data: thread, status, refresh } = useApi<Thread>(() => `/api/threads/${threadId.value}`, {
  lazy: true,
  watch: [() => threadId],
})
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
          @click="emits('close')"
        />
      </template>
    </UDashboardNavbar>

    <div class="p-4 sm:p-6">
      <UAlert
        variant="soft"
        title="Laden van melding mislukt"
        description="De melding kon niet worden geladen"
        :actions="[{
          label: 'Herladen',
          icon: 'i-lucide-rotate-ccw',
          onClick: refresh,
        }]"
      />
    </div>
  </UDashboardPanel>

  <ThreadsViewMessageLoading v-else-if="status !== 'success'" :thread-id="threadId" @close="emits('close')" />
  <ThreadsViewMessage v-else-if="thread" :thread="thread" @close="emits('close')" />
</template>
