<script lang="ts" setup>
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { name: 'theme-color', content: color },
  ],
})

const title = 'Penis LogistiekApp'
const description = 'De app voor Team Logistiek'

useSeoMeta({
  title,
  description,
  robots: 'noindex, nofollow',
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
