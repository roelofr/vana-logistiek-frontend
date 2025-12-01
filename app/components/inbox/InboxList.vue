<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Mail } from '~/types'

const props = defineProps<{
  mails: Mail[]
  isLoading: boolean
}>()

const mailsRefs = ref<Element[]>([])

const selectedMail = defineModel<Mail | null>()

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return
  }
  const ref = mailsRefs.value[selectedMail.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex(mail => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[0]
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1]
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex(mail => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[props.mails.length - 1]
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1]
    }
  }
})
</script>

<template>
  <div class="divide-y divide-default" :class="[isLoading ? 'overflow-y-hidden' : 'overflow-y-auto']">
    <template v-if="isLoading">
      <div
        v-for="index in Array(30)"
        :key="index"
      >
        <div
          class="space-y-1 p-4 sm:px-6 text-sm border-l-2 transition-colors border-(--ui-bg)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <USkeleton class="h-4 w-[140px]" />
            </div>

            <USkeleton class="h-4 w-[40px]" />
          </div>

          <p class="truncate">
            <USkeleton class="h-4 w-[200px]" />
          </p>

          <p class="text-dimmed line-clamp-1">
            <USkeleton class="h-4 w-full" />
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(mail, index) in mails"
        :key="index"
        :ref="el => { mailsRefs[mail.id] = el as Element }"
      >
        <div
          class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
          :class="[
            mail.unread ? 'text-highlighted' : 'text-toned',
            selectedMail && selectedMail.id === mail.id
              ? 'border-primary bg-primary/10'
              : 'border-(--ui-bg) hover:border-primary hover:bg-primary/5'
          ]"
          @click="selectedMail = mail"
        >
          <div class="flex items-center justify-between" :class="[mail.unread && 'font-semibold']">
            <div class="flex items-center gap-3">
              {{ mail.from.name }}

              <UChip v-if="mail.unread" />
            </div>

            <span>{{
              isToday(new Date(mail.date)) ? format(new Date(mail.date), 'HH:mm') : format(new Date(mail.date), 'dd MMM')
            }}</span>
          </div>
          <p class="truncate" :class="[mail.unread && 'font-semibold']">
            {{ mail.subject }}
          </p>
          <p class="text-dimmed line-clamp-1">
            {{ mail.body }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
