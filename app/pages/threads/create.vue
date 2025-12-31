<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'

import * as z from 'zod'
import type { Thread } from '~/types'

const { $api } = useNuxtApp()

const schema = z.object({
  vendor: z.looseObject({
    id: z.number(),
    name: z.string(),
    number: z.string(),
  }, 'Standhouder is verplicht'),
  subject: z.string('Onderwerp is verplicht')
    .min(4, 'Onderwerp moet minimaal 4 tekens zijn'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  vendor: undefined,
  subject: undefined,
})

const toast = useToast()
const onSubmit = async (_event: FormSubmitEvent<Schema>): Promise<void> => {
  try {
    const data = await $api<Thread>('/api/threads', {
      method: 'post',
      body: {
        subject: state.subject,
        vendorId: state.vendor!.id,
      },
    })

    toast.add({
      color: 'success',
      title: 'Melding aangemaakt',
      description: `Melding ${data.id} is succesvol aangemaakt.`,
    })
  } catch (e) {
    console.error('Aanmaken melding mislukt: %o', e)
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Nieuwe melding" />
    </template>

    <template #body>
      <div class="w-full max-w-lg mx-auto">
        <UPageHeader
          subject="Maak snel een melding aan, dan pakt de CP het verder op :)"
          title="Nieuwe melding"
        />

        <UPageBody>
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="Standhouder" name="vendor">
              <InputsVendorSelect v-model="state.vendor" name="vendor" size="xl" />
            </UFormField>

            <UFormField label="Onderwerp" name="subject">
              <UInput
                v-model="state.subject"
                label="Onderwerp"
                name="subject"
                size="xl"
              />
            </UFormField>

            <UButton block size="xl" type="submit">
              Melding aanmaken
            </UButton>

            <DevOnly>
              <UCard>
                <pre><code>{{ JSON.stringify(state, undefined, 2) }}</code></pre>
              </UCard>
            </DevOnly>
          </UForm>
        </UPageBody>
      </div>
    </template>
  </UDashboardPanel>
</template>
