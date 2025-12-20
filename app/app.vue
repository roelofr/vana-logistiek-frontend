<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/logo.svg', type: 'image/svg' }
  ],
  htmlAttrs: { lang: 'nl' }
})

const title = 'Penis LogistiekApp'
const description = 'De app voor Team Logistiek'

useSeoMeta({
  title,
  description,
  robots: 'noindex, nofollow'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
