<script setup lang="ts">
import type {Vendor} from '~/types'
import {boolean, type InferType, object, string} from 'yup'
import type {RadioGroupItem} from '@nuxt/ui/components/RadioGroup.vue'
import type {FormSubmitEvent} from "@nuxt/ui";

const modalOpen = defineModel<boolean>('open', {default: false})
const modalDesc = ref<string | undefined>(undefined)

const schema = object({
  hasVendor: boolean().required('Verplicht'),
  vendor: object<Vendor>().when('hasVendor', {
    is: true,
    then: () => object().required(),
    otherwise: () => object().nullable(),
  }),
  subject: string().required('Verplicht'),
  description: string().min(10, 'Minimaal 10 karakters').optional(),
})

type Schema = InferType<typeof schema>
type SchemaAndVendor = Omit<Schema, 'vendor'> & { vendor: Vendor | null }

const hasVendorOpts = ref<RadioGroupItem[]>([
  {
    value: 0,
    label: 'Nee',
    description: 'Dit is een algemeen bericht aan de CP.',
  },
  {
    value: 1,
    label: 'Ja',
    description: 'Dit is een bericht over een specifieke standhouder.',
  },
])

const issue = reactive<SchemaAndVendor>({
  hasVendor: false,
  vendor: null as Vendor | null,
  subject: '',
  description: '',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<SchemaAndVendor>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success',
  })
  console.log(event.data)
}
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    title="Nieuwe melding"
    :description="modalDesc"
    class="w-175 max-w-[90vw]"
    :dismissible="false"
  >
    <template #body>
      <LazyUForm
        :schema="schema"
        :state="issue"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Is er een standhouder?"
          name="hasVendor"
          description="Heeft deze melding betrekking op één standhouder?"
        >
          <URadioGroup v-model="issue.hasVendor" :items="hasVendorOpts"/>
        </UFormField>

        <UFormField
          v-if="issue.hasVendor"
          label="Standhouder"
          description="Welke standhouder is betrokken bij deze melding?"
          name="vendor"
        >
          <InputVendor v-model="issue.vendor"/>
        </UFormField>

        <UFormField
          name="subject"
          label="Onderwerp"
          description="Waar gaat deze melding over?"
        >
          <UInput v-model="issue.subject"/>
        </UFormField>

        <UFormField
          name="description"
          label="Beschrijving (optioneel)"
          description="Als je wilt, kan je alvast het eerste bericht in de chat hier typen."
        >
          <UTextarea v-model="issue.description"/>
        </UFormField>

        <UButton type="submit">
          Melding aanmaken
        </UButton>
      </LazyUForm>
    </template>
  </UModal>
</template>

<style scoped></style>
