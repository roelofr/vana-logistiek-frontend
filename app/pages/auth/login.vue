<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})

const { signIn, isLoading } = useAuth()

function doSignIn(): void {
  signIn()
}

const providers = [
  {
    label: 'Troela Login',
    onClick: doSignIn,
  },
]
</script>

<template>
  <UAuthForm
    :loading="isLoading"
    :providers="providers"
    title="Welkom"
  >
    <template #leading>
      <div class="mb-4 text-center">
        <Logo />
      </div>
    </template>
    <template #description>
      <p>Log in via onderstaande knop om door te gaan.</p>
    </template>

    <template #footer>
      <p>
        Indien je nog geen account hebt, kan je deze aanvragen bij Tessa.
      </p>
    </template>
  </UAuthForm>
</template>
