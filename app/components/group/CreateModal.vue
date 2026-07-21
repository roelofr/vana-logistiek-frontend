<script setup lang="ts">
import { object, string } from "yup";
import { UForm } from "#components";
import { FetchError } from "ofetch";

const emit = defineEmits<{ refresh: [] }>();

const open = ref(false);
const isLoading = ref(false);
const createError = ref(null as null | string);

const form = useTemplateRef<HTMLFormElement>("form");
const toast = useToast();

const schema = object({
  name: string().required("Naam is verplicht"),
  icon: string().nullable(),
  colour: string().nullable(),
});

const state = reactive({
  name: undefined,
  icon: undefined,
  colour: undefined,
});

function close() {
  open.value = false;
}

// Reset on open
watch(open, (newOpen, oldOpen) => {
  if (newOpen && !oldOpen) {
    createError.value = null;
    state.name = undefined;
    state.icon = undefined;
    state.colour = undefined;
    form.value?.reset();
  }
});

async function create() {
  isLoading.value = true;

  try {
    await $fetch("/api/admin/groups", {
      method: "POST",
      body: {
        name: state.name,
        icon: state.icon,
        colour: state.colour,
      },
    });

    close();

    emit("refresh");

    toast.add({
      color: "success",
      title: "Groep toegevoegd",
      description: `Groep ${state.name} is toegevoegd.`,
    });
  } catch (e) {
    if (e instanceof FetchError && e.statusCode == 400)
      createError.value = "Een of meer velden zijn niet geldig";
    else if (e instanceof FetchError && e.statusCode == 403)
      createError.value = "Gekkie! Je hebt helemaal niet de rechten hiervoor!";
    else if (e instanceof FetchError && e.statusCode == 409)
      createError.value = "Er bestaat al een groep met deze naam";
    else createError.value = String(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Nieuwe groep">
    <UButton variant="soft" leading-icon="i-lucide-plus">Nieuwe groep</UButton>

    <template #body>
      <UAlert
        v-if="createError"
        color="error"
        icon="i-lucide-octagon-alert"
        class="mb-4"
        :description="createError"
      />

      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        autocomplete="off"
        @submit="create()"
      >
        <UFormField name="name" label="Naam" required>
          <UInput v-model="state.name" placeholder="Pietertjes Pretparadijs" />
        </UFormField>

        <UFormField name="icon" label="Icoon" description="Naam van de groep">
          <UInput v-model="state.icon" placeholder="theater" />

          <template #description>
            Zie
            <a href="https://lucide.dev" target="_blank" rel="noopener"
              >lucide.dev</a
            >
            voor een overzicht.
          </template>
        </UFormField>

        <UFormField
          name="colour"
          label="Kleur"
          description="Gewenste kleur voor de avatar"
        >
          <UInput v-model="state.colour" placeholder="amber" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex ml-auto gap-4">
        <UButton color="neutral" variant="outline" @click="close()"
          >Annuleren</UButton
        >
        <UButton :loading="isLoading" @click="form?.submit()">Opslaan</UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
