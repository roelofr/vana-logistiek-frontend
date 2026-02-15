<script setup lang="ts">
import type { ListThread, ThreadUpdate } from '~/types'
import { expand, formattedLocalTime } from '~/utils'

const { thread } = defineProps<{
  thread: ListThread
}>()

const emits = defineEmits(['close'])

const reply = ref('')
const loading = ref(false)

const {
  data: updates,
  status: updatesStatus,
  refresh: updatesRefresh,
} = useApi<ThreadUpdate[]>(() => `/api/threads/${thread.id}/updates`, {
  lazy: true,
  watch: [() => thread],
})

const updatesExpanded = computed(() => expand(updates.value, ['user', 'team', 'thread']))

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

watch(() => thread, () => {
  reply.value = ''
  loading.value = false
}, {
  immediate: false,
})
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="`Melding ${thread?.id ?? thread.id}`" :toggle="false">
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
        <div class="flex items-center gap-4">
          <VendorAvatar size="lg" :vendor="thread.vendor" />

          <div class="min-w-0">
            <p class="font-semibold text-highlighted">
              {{ thread.vendor?.name }}
            </p>
            <div class="text-muted flex flex-row items-center gap-2">
              <VendorNumber :vendor="thread.vendor" />
              <p>{{ thread.vendor?.district?.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-muted text-sm sm:mt-2">
        {{ formattedLocalTime(thread.createdAt, 'dd MMM HH:mm') }}
      </p>
    </div>

    <UScrollArea class="flex-1 p-4 sm:p-6">
      <ThreadsUpdateList v-if="updatesStatus == 'success'" :updates="updatesExpanded" />
      <UAlert
        v-else-if="updatesStatus == 'error'"
        color="error"
        description="De berichten konden niet worden geladen, probeer het later opnieuw."
        icon="i-lucide-triangle-alert"
        title="Laden mislukt"
        variant="soft"
      />
      <div v-else class="my-4 flex flex-row items-center justify-center gap-2 text-dimmed">
        <UIcon class="animate-spin" name="i-lucide-loader" size="20" />
        <span>Berichten worden opgehaald...</span>
      </div>
    </UScrollArea>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <ThreadsInteractWithMessage :thread="thread" @update="updatesRefresh" />
    </div>
  </UDashboardPanel>
</template>
