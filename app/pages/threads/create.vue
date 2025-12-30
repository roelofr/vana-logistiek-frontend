<script setup lang="ts">
import type { Vendor } from '~/types'
import type { FormSubmitEvent } from '@nuxt/ui'

const vendor = ref<Vendor | undefined>(undefined)

const toast = useToast()
const createVendor = (event: FormSubmitEvent<any>): void => {
  event?.preventDefault()

  toast.add({
    title: 'Thread created!',
    description: `A new thread was created for <strong>${vendor.value?.name}</strong>`,
  })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Nieuwe melding" />
    </template>

    <template #body>
      <UForm @submit="createVendor">
        <UFormField name="vendor" label="Vendor">
          <InputsVendorSelect v-model="vendor" />
        </UFormField>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
