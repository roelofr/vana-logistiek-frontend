<script setup lang="ts">
import type {ButtonProps} from "@nuxt/ui/components/Button.vue";

definePageMeta({
  middleware: ['guest'],
})

const {signIn} = useAuth()

const isLoading = ref<boolean>(true)

const requestQuery = useRoute().query
const userError = ref<string | null>(null)
const errorMessage = computed(() => {
  if (userError.value)
    return userError.value

  const error = requestQuery?.error
  if (!error) return null

  switch (error) {
    case 'please_restart_the_process':
      return 'De inlogactie is verlopen.'

    case 'rejected':
      return 'Je hebt het inloggen geannuleerd.'

    default:
      return `Er is een onbekende fout opgetreden: ${error}.`
  }
})

effect(() => (isLoading.value = false))

async function doSignIn(): Promise<void> {
  try {
    isLoading.value = true
    await signIn()
  } catch (err) {
    userError.value = err instanceof Error ? err.message : 'An unknown error occurred.'
    isLoading.value = false
  }
}

const providers = computed(() => [
  {
    color: 'primary',
    label: 'Troela Login',
    onClick: doSignIn,
    disabled: isLoading.value,
    icon: 'i-lucide-laugh',
    size: 'lg',
  },
] as ButtonProps[])

</script>

<template>
  <UAuthForm
    :loading="isLoading"
    :providers="providers"
    title="Welkom"
  >
    <template #leading>
      <div class="mb-4 text-center">
        <Logo/>
      </div>
    </template>
    <template #description>
      <p>Log in via onderstaande knop om door te gaan.</p>

      <UAlert
        v-if="errorMessage"
        color="error"
        icon="i-lucide-info"
        :description="errorMessage"
        title="Inloggen mislukt"
        class="mt-4 text-start"
      />
    </template>

    <template #footer>
      <p>
        Indien je nog geen account hebt, kan je deze aanvragen bij Tessa.
      </p>
    </template>
  </UAuthForm>
</template>
