<script setup lang="ts">
import type { UserMeDto } from "~/types";

const open = defineModel<boolean>("open");

const {
  data: profile,
  pending: profilePending,
  execute: profileExecute,
  status: profileStatus,
  clear: profileClear,
} = useLazyFetch<UserMeDto>("/api/users/me", {
  immediate: false,
});

const isSending = ref(false);
const isLoading = computed(() => isSending.value || profilePending.value);

const atWork = ref(false);

watch(open, (newOpen) => {
  if (newOpen && profileStatus.value == "idle") profileExecute();
});

watch(profile, (newProfile) => {
  if (newProfile) atWork.value = newProfile.flags.includes("active");
});

function close() {
  open.value = false;
  profileClear();
}

const toast = useToast();
async function saveAndClose() {
  isSending.value = true;

  try {
    const isActive = atWork.value;

    await $fetch("/api/users/me/active", {
      method: "POST",
      body: { isActive },
    });

    toast.add({
      title: "Status bijgewerkt",
      icon: isActive ? "i-lucide-pickaxe" : "i-lucide-parasol",
      description: isActive
        ? 'Je staat nu als "aan het werk" gemarkeerd'
        : 'Je staat niet meer als "aan het werk" gemarkeerd',
    });

    close();
  } catch (error) {
    console.error("Failed to set active to %o: %o", atWork, error);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Werkstatus"
    description="Geef aan of je rondjes loopt"
  >
    <template #body>
      <p class="leading-loose">
        Als je wil, kan je hieronder aangeven of je aan het werk bent.
      </p>
      <p class="text-sm leading-relaxed">
        Niet verplicht, wel handig voor je mede-vrijwilligers of je aan het
        medewerken bent, of mede aan het wegwerken bent.
      </p>
      <div class="mt-4 flex justify-center">
        <USwitch
          v-model="atWork"
          :loading="isLoading"
          size="xl"
          checked-icon="i-lucide-pickaxe"
          unchecked-icon="i-lucide-parasol"
          label="Aan het werk"
        />
      </div>

      <p class="mt-4 text-xs text-muted">
        We slaan alleen een “Ja” of “Nee” op, meer niet.
      </p>
    </template>
    <template #footer>
      <UButton class="ml-auto" variant="soft" color="neutral" @click="close()">
        Annuleren
      </UButton>
      <UButton :loading="isLoading" @click="saveAndClose()">Opslaan</UButton>
    </template>
  </UModal>
</template>

<style scoped></style>
