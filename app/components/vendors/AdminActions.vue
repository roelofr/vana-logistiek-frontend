<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Vendor } from "~/types";

const emit = defineEmits<{ update: [] }>();

const toast = useToast();
const { open: openFileDialog, onChange: onFileDialogChange } = useFileDialog({
  accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  directory: false,
  multiple: false,
});

const importLoading = ref(false);

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Importeren",
      icon: "i-lucide-database-arrow-up",
      onClick: () => openFileDialog(),
      loading: importLoading.value,
      disabled: importLoading.value,
    },
  ],
]);

onFileDialogChange(async (files) => {
  if (!files || files.length != 1) {
    toast.add({
      title: "Import geannuleerd",
      description: "Er is geen bestand geselecteerd",
      color: "error",
    });

    return;
  }

  importLoading.value = true;

  const { id: loadingToast } = toast.add({
    title: "Bestand uploaden",
    icon: "i-lucide-loader-circle",
    close: false,
    duration: 0,
    ui: { icon: "animate-spin" },
  });

  try {
    const formData = new FormData();
    formData.append("file", files[0]!);

    const result = await $fetch<Vendor[]>("/api/vendors/admin/import", {
      method: "POST",
      body: formData,
    });

    if (result.length === 0) {
      toast.add({
        title: "Geen nieuwe standhouders toegevoegd.",
        icon: "i-lucide-check",
        color: "info",
      });
      return;
    }

    console.log("New vendors = %o", result);

    toast.add({
      title: `Er zijn ${result.length} nieuwe standhouders toegevoegd.`,
      icon: "i-lucide-check",
      color: "info",
    });

    emit("update");
  } catch (error) {
    console.error("Error importing vendors: %o", error);

    let message =
      "Er is iets misgegaan bij het importeren van de standhouders.";
    if (error.data) message = error.data;

    toast.add({
      title: "Import mislukt",
      description: message,
      color: "error",
    });
  } finally {
    toast.remove(loadingToast);
    importLoading.value = false;
  }
});
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      trailing-icon="i-lucide-chevron-down"
      color="neutral"
      variant="outline"
    >
      Beheer
    </UButton>
  </UDropdownMenu>
</template>
