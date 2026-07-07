<script lang="ts" setup>
import * as z from "zod";
import type {FormSubmitEvent} from "@nuxt/ui";

interface ProfileResponse {
  id: number
  name: string
  email: string;
  roles: string[];
  groups: string[]
  avatarUrl: string | null;
}

interface ProfileSchema {
  name: string
  email: string
  avatar: string
}

const {data: userData, refresh} = await useFetch<ProfileResponse>("/api/profile")
const avatarUrl = computed(() => {
  const avatar = userData.value!.avatarUrl ?? null
  if (!avatar)
    return null

  const avatarUrl = new URL(avatar, 'https://example.com');
  avatarUrl.searchParams.set('_', Date.now().toString());
  return avatarUrl.toString()
})

const profile = reactive<ProfileSchema>({
  name: userData.value!.name,
  email: userData.value!.email,
  avatar: avatarUrl.value,
});
const toast = useToast();

watch(userData, () => {
  if (!userData.value)
    return

  profile.name = userData.value!.name
  profile.email = userData.value!.email
})

async function onSubmit(_event: FormSubmitEvent<ProfileSchema>) {
  toast.add({
    title: "Success",
    description: "Your settings have been updated.",
    icon: "i-lucide-check",
    color: "success",
  });
}

const avatarUploading = ref(false)
const {files, open: selectFile, onChange} = useFileDialog({
  accept: 'image/webp,image/jpeg,image/png',
})

onChange(async () => {
  const pickedFile = files.value?.item(0);
  if (pickedFile == null)
    return

  avatarUploading.value = true

  try {
    const formData = new FormData()
    formData.set('picture', pickedFile)

    await $fetch("/api/profile/picture", {
      method: 'PUT',
      body: formData
    })

    toast.add({
      color: 'success',
      title: 'Profielafbeelding aangepast!',
      description: 'Het kan even duren voordat de wijziging overal zichtbaar is.',
    })

    refresh()
  } finally {
    avatarUploading.value = false
  }
})
</script>

<template>
  <UForm>
    <UPageCard
      class="mb-4"
      description="Deze informatie is zichtbaar voor alle gebruikers in de app."
      orientation="horizontal"
      title="Profiel"
      variant="naked"
    >
      &nbsp;
    </UPageCard>

    <UPageCard variant="subtle" class="mb-4">
      <UFormField
        class="flex max-sm:flex-col justify-between items-start gap-4"
        description="Wordt door de hele applicatie getoond."
        label="Naam"
        name="name"
      >

        <UInput disabled v-model="profile.name" autocomplete="off"/>
      </UFormField>
      <USeparator/>
      <UFormField
        class="flex max-sm:flex-col justify-between items-start gap-4"
        description="Wordt gebruikt om in te loggen in de LogistiekApp."
        label="E-mailadres"
        name="email"
      >

        <UInput disabled v-model="profile.email" autocomplete="off" type="email"/>
      </UFormField>
    </UPageCard>
  </UForm>

  <UPageCard variant="subtle">
    <UFormField
      class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      description="JPEG, PNG of WEBP. Maximaal 15 MB."
      label="Profielfoto"
    >
      <div class="flex flex-wrap items-center gap-3">
        <UAvatar :alt="profile.name" :src="profile.avatar" size="lg"/>
        <UButton color="neutral" label="Kiezen" @click="selectFile" :disabled="avatarUploading"/>
      </div>
    </UFormField>
  </UPageCard>
</template>
