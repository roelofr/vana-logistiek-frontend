<script lang="ts" setup>
import type { Group, UserMeDto } from "~/types";
import { FetchError } from "ofetch";

const toast = useToast();
const { refresh: refreshSession } = useSession();
const { files, open: openFileDialog } = useFileDialog();

const { data: user } = useLazyFetch<UserMeDto>("/api/users/me");

const modalOpen = ref(false);
const formError = ref<string | null>(null);
const chosenGroup = ref<Group | undefined>(undefined);

const chosenImage = computed<File | null>(() => files.value?.item(0) ?? null);
const chosenImageUrl = ref<string | undefined>();

const userOnboarded = computed(() =>
  user.value ? Boolean(user.value.flags?.includes("onboarded")) : null,
);
const userGroup = computed(() => user.value?.groups?.at(0) ?? null);

onMounted(() => {
  if (userOnboarded.value === false) modalOpen.value = true;
});

watch(userOnboarded, (isOnboarded) => {
  if (isOnboarded === false) modalOpen.value = true;
});

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
  openFileDialog({ accept: "image/webp,image/jpeg,image/png" });
}

async function closeDialog(error: string | null = null): Promise<void> {
  if (error)
    toast.add({
      color: "warning",
      title: "Onboarden mislukt",
      description: error,
    });

  await refreshSession();

  modalOpen.value = false;
}

function showError(error: string | null): void {
  formError.value = error;
}

async function trySubmit(): Promise<void> {
  if (!chosenImage.value) return showError("Je moet een afbeelding kiezen.");

  const data = new FormData();
  data.set("picture", chosenImage.value!);

  if (chosenGroup.value && !userGroup.value)
    data.set("groupId", `${chosenGroup.value!.id}`);

  try {
    await $fetch("/api/users/me/onboard", {
      method: "POST",
      body: data,
    });

    closeDialog();
  } catch (error) {
    const errorCode = error instanceof FetchError ? error.statusCode : 999;

    switch (errorCode) {
      case 400:
        return showError("Je moet echt een afbeelding kiezen.");
      case 401:
        return closeDialog("Je account is al geconfigureerd.");
      case 404:
        return showError("De opgegeven groep bestaat niet!?");
      case 409:
        return showError(
          "Je kan geen groep kiezen, als je al in een groep zit.",
        );
      case 500:
        return showError("Instellen van foto mislukt.");
      default:
        return showError("Er ging iets fout.");
    }
  }
}
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    :close="false"
    title="Welkom in de LogistiekApp"
  >
    <template #body>
      <template v-if="!user">
        <div class="p-4 flex items-center gap-4">
          <UAvatar color="primary" icon="i-lucide-spinner" size="xl" />
          <span class="text-lg">Laden...</span>
        </div>
      </template>

      <div v-else class="space-y-4">
        <h1 class="text-lg">Welkom in de LogistiekApp {{ user!.name }}!</h1>
        <UAlert v-if="formError" color="warning" :description="formError" />
        <p>
          Voordat je verder kan, vragen we je even een profielfoto te uploaden.
          Maakt de app en de beleving iets persoonlijker.
        </p>

        <div class="flex flex-col gap-4 items-center">
          <UAvatar
            :src="chosenImageUrl"
            class="mx-auto"
            icon="i-lucide-file-image"
            :ui="{ root: 'w-40 h-40 text-[4rem]' }"
          />

          <UButton
            size="lg"
            :color="chosenImage ? 'neutral' : 'primary'"
            @click="selectAvatar()"
          >
            <template v-if="chosenImage">Verander afbeelding</template>
            <template v-else>Kies afbeelding of maak foto</template>
          </UButton>
        </div>

        <h2 class="text-lg">Groepje!</h2>

        <template v-if="userGroup">
          <p>
            Je bent ingedeeld in groep
            <GroupAvatar :group="userGroup" size="sm" />
            {{ userGroup.name }}.
          </p>
        </template>
        <template v-else>
          <p>
            Je bent nog niet ingedeeld in een groep. Je kan nu eenmalig
            hieronder een groep kiezen, als je dit weet.
          </p>
          <GroupSelect v-model="chosenGroup" />
          <p class="text-muted text-sm">
            Als je dit niet weet, kan een beheerder je altijd nog in de goede
            groep gooien (of er weer uit, als je het fout hebt).
          </p>
        </template>
      </div>
    </template>

    <template #footer>
      <UButton class="ml-auto" @click="trySubmit()">Versturen</UButton>
    </template>
  </UModal>
</template>

<style scoped></style>
