<script setup lang="ts">
import type { Vendor } from '~/types'
import type { FormSubmitEvent } from '@nuxt/ui'

import * as z from 'zod'

const schema = z.object({
  vendor: z.looseObject({
    id: z.number(),
    name: z.string(),
    number: z.string(),
  } satisfies Vendor, 'Standhouder is verplicht'),
  description: z.string('Omschrijving is verplicht')
    .min(4, 'Omschrijving moet minimaal 4 tekens zijn'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  vendor: undefined,
  description: undefined,
})

const toast = useToast()
const onSubmit = (event: FormSubmitEvent<Schema>): void => {
  event?.preventDefault()

  console.log('Data is %o', event.data)

  toast.add({
    title: 'Thread created!',
    description: `A new thread was created.`,
  })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Nieuwe melding" />
    </template>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField name="vendor" label="Standhouder">
          <InputsVendorSelect v-model="state.vendor" />
        </UFormField>

        <UFormField name="description" label="Omschrijving">
          <UInput name="description" label="Omschrijving" />
        </UFormField>

        <UButton type="submit">
          Submit
        </UButton>

        <DevOnly>
          <UCard>
            <pre><code>{{ JSON.stringify(state, undefined, 2) }}</code></pre>
          </UCard>
        </DevOnly>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
