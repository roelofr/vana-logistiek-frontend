<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const close = () => {
  open.value = false
}

const accessToken = useAccessToken()
const form = useTemplateRef('form')

const schema = z.object({
  token: z.jwt().nullable(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  token: accessToken.value,
})

const toast = useToast()

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  _event.preventDefault()
  accessToken.value = state.token ?? null

  toast.add({
    title: 'Access Token Updated',
    color: 'success',
  })

  await refreshNuxtData()

  close()
}

async function doClearToken() {
  accessToken.value = null
  state.token = null

  toast.add({
    title: 'Access Token Cleared',
    color: 'success',
  })

  await refreshNuxtData()

  close()
}
</script>

<template>
  <UModal v-model:open="open" title="Set access token">
    <UButton
      block
      color="neutral"
      label="Set access token"
      variant="subtle"
    />

    <template #body>
      <UForm
        id="access-token"
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Access Token" name="token">
          <template #description>
            You can retrieve an access token from the
            <ULink
              external
              href="http://localhost:8080/api/users/me/token"
              target="_blank"
            ><code>/users/me/token</code> API
            </ULink>
          </template>
          <UTextarea v-model="state.token" autoresize />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex flex-row items-center justify-end gap-4 w-full">
        <UButton
          color="error"
          form="access-token"
          icon="i-lucide-trash"
          variant="outline"
          @click="doClearToken()"
        >
          Clear
        </UButton>
        <UButton
          form="access-token"
          icon="i-lucide-save"
          @click="form?.submit()"
        >
          Update
        </UButton>
      </div>
    </template>
  </UModal>
</template>
