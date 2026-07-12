<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Chat } from "~/types";

const { chat } = defineProps<{ chat: Chat }>()

const emit = defineEmits<{ refresh: [] }>()

const items = computed<DropdownMenuItem[]>(() => {
  const actions: DropdownMenuItem[] = []

  if (chat.subject != null && chat.subject.resolvedAt == null)
    actions.push({
      label: 'Markeer als opgelost',
      icon: 'i-lucide-check',
      onClick: async () => {
        await useFetch(`/api/issues/${chat.subject!.id}/resolve`, { method: 'POST' })
        emit('refresh')
      }
    })

  return actions
})
</script>

<template>
  <UDropdownMenu
    :content="{
      side: 'bottom',
    }"
    :items="items"
    :ui="{
      content: 'w-48'
    }"
  >
    <UButton color="neutral" icon="i-lucide-menu" label="Open" variant="outline" :disabled="items.length == 0"/>
  </UDropdownMenu>
</template>

<style scoped>
</style>
