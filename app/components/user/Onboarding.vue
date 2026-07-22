<script setup lang="ts">
import type { Group, UserMeDto } from "~/types";

const { data: user } = useLazyFetch<UserMeDto>("/api/users/me");

const { files, open, reset } = useFileDialog();

const modalOpen = ref(false);
watch(user, (newUser) => {
  if (newUser && newUser.flags?.includes("onboarded") === false)
    modalOpen.value = true;
});

watch(modalOpen, (isOpen, wasOpen) => {
  if (isOpen && !wasOpen) reset();
});

const chosenGroup = ref<Group | undefined>(undefined);
const chosenImage = computed<File | null>(() => files.value?.item(0) ?? null);
const chosenImageUrl = ref<string | undefined>();

watch(chosenImage, (image) => {
  // Delete old URL
  if (chosenImageUrl.value) {
    URL.revokeObjectURL(chosenImageUrl.value);
    chosenImageUrl.value = undefined;
  }

  // Create new URL
  if (image) {
    chosenImageUrl.value = URL.createObjectURL(image);
  }
});

onUnmounted(() => {
  if (chosenImageUrl.value) URL.revokeObjectURL(chosenImageUrl.value);
});

function selectAvatar() {
  open({ accept: "image/webp,image/jpeg,image/png" });
}

const userGroup = computed(() => user.value?.groups?.at(0) ?? null);

const group = computed<Group | undefined>(
  () => userGroup.value ?? chosenGroup.value,
);
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    :close="false"
    title="Welkom in de LogistiekApp"
  >
    <template v-if="user" #body>
      <p class="text-lg">Welkom in de LogistiekApp {{ user!.name }}!</p>
      <p>
        Voordat je de app kan gebruiken, vragen we even onderstaand fomulier in
        te vullen.
      </p>

      <UCard>
        <UUser :name="user.name">
          <template #avatar>
            <UAvatar :src="chosenImageUrl" :icon="user" />
          </template>
          <template #description>
            <template v-if="group">
              Lid van <GroupAvatar :group="group" size="xs" /> {{ group.name }}
            </template>
            <span v-else class="text-muted"> Nog geen groep gekozen. </span>
          </template>
        </UUser>
      </UCard>

      <UButton icon="i-lucide-file-image" @click="selectAvatar()"
        >Selecteer profielfoto</UButton
      >
    </template>

    <template #footer> </template>
  </UModal>
</template>

<style scoped></style>
