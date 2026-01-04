<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'

import * as z from 'zod'
import type { Thread } from '~/types'

const { $api } = useNuxtApp()
const router = useRouter()

const emits = defineEmits(['close'])

const { data: suggestedOptions } = useApi<string[]>('/api/settings/suggested-options', {
  default: () => [
    'Bijbestelling',
    'Service',
    'Techniek',
    'Gatorteam',
  ],
})

const schema = z.object({
  vendor: z.looseObject({
    id: z.number(),
    name: z.string(),
    number: z.string(),
  }, 'Standhouder is verplicht'),
  subject: z.string('Onderwerp is verplicht')
    .min(2, 'Onderwerp moet minimaal 2 tekens zijn')
    .max(30, 'Onderwerp moet maximaal 30 tekens zijn'),
  message: z.nullish(z.string()),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  vendor: undefined,
  subject: undefined,
  message: undefined,
})

const toast = useToast()
const onSubmit = async (_event: FormSubmitEvent<Schema>): Promise<void> => {
  try {
    const data = await $api<Thread>('/api/threads', {
      method: 'post',
      body: {
        vendorId: state.vendor!.id,
        subject: state.subject,
        message: state.message?.trim() ? state.message : null,
      },
    })

    toast.add({
      color: 'success',
      title: 'Melding aangemaakt',
    })

    await router.push(`/threads/${data.id}`)
  } catch (e) {
    console.error('Aanmaken melding mislukt: %o', e)
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Nieuwe melding" :toggle="false">
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
    </template>

    <template #body>
      <div class="w-full max-w-lg mx-auto">
        <UPageHeader
          subject="Maak snel een melding aan, dan pakt de CP het verder op :)"
          title="Nieuwe melding"
        />

        <UPageBody>
          <UScrollArea>
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <UFormField
                label="Standhouder"
                name="vendor"
                required
              >
                <InputsVendorSelect v-model="state.vendor" name="vendor" size="xl" />
              </UFormField>

              <UFormField
                label="Onderwerp"
                name="subject"
                description="Snelle omschrijving, 2-30 tekens."
                :help="`Suggesties: ${suggestedOptions!.join(', ')}`"
                required
              >
                <UInput
                  v-model="state.subject"
                  label="Onderwerp"
                  name="subject"
                  size="xl"
                />

                <template #help>
                  <div class="flex flex-row justify-start items-center flex-wrap gap-2">
                    <span class="text-sm text-muted">
                      Suggesties
                    </span>
                    <UButton
                      v-for="value of suggestedOptions"
                      :key="value"
                      size="sm"
                      variant="soft"
                      class="rounded-full"
                      @click="state.subject = value"
                    >
                      {{ value }}
                    </UButton>
                  </div>
                </template>
              </UFormField>

              <UFormField
                label="Bericht"
                name="message"
                description="Plaats direct een eerste bericht in de conversatie. Hoeft niet, mag wel."
              >
                <UTextarea
                  v-model="state.message"
                  label="Bericht"
                  name="message"
                  :rows="3"
                  autocapitalize="sentences"
                  size="xl"
                />
              </UFormField>

              <UButton
                block
                size="xl"
                type="submit"
                icon="i-lucide-rocket"
              >
                Melding aanmaken
              </UButton>

              <LazyDevOnly>
                <UCard>
                  <pre><code>{{ JSON.stringify(state, undefined, 2) }}</code></pre>
                </UCard>
              </LazyDevOnly>
            </UForm>
          </UScrollArea>
        </UPageBody>
      </div>
    </template>
  </UDashboardPanel>
</template>
