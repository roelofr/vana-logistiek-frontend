<script setup lang="ts">
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
    description: 'You may need to reload the page for everything to update properly.',
    color: 'success',
  })

  close()
}

function doClearToken() {
  accessToken.value = null
  state.token = null

  toast.add({
    title: 'Access Token Cleared',
    description: 'You may need to reload the page for everything to update properly.',
    color: 'success',
  })

  close()
}
</script>

<template>
  <UModal v-model:open="open" title="Set access token">
    <UButton
      label="Set access token"
      color="neutral"
      variant="subtle"
      block
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
              target="_blank"
              href="http://localhost:8080/api/q/dev-ui/quarkus-oidc/openid-connect-dev-console"
              external
            >OpenID Connect Dev Console
            </ULink>
          </template>
          <UTextarea v-model="state.token" autoresize />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex flex-row items-center justify-end gap-4 w-full">
        <UButton
          form="access-token"
          variant="outline"
          color="error"
          icon="i-lucide-trash"
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
