<script lang="ts" setup>
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters'),
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    description="Confirm your current password before setting a new one."
    title="Password"
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          class="w-full"
          placeholder="Current password"
          type="password"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          class="w-full"
          placeholder="New password"
          type="password"
        />
      </UFormField>

      <UButton class="w-fit" label="Update" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    class="bg-gradient-to-tl from-error/10 from-5% to-default"
    description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    title="Account"
  >
    <template #footer>
      <UButton color="error" label="Delete account" />
    </template>
  </UPageCard>
</template>
