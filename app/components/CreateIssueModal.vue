<script setup lang="ts">
import type {Vendor} from "~/types";
import {boolean, type InferType, object, string} from "yup";
import type {RadioGroupItem} from "@nuxt/ui/components/RadioGroup.vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const modalOpen = defineModel<boolean>("open", {default: false});
const modalDesc = ref<string | undefined>(undefined);

const schema = object({
  hasVendor: boolean().required("Verplicht"),
  vendor: object<Vendor>().when("hasVendor", {
    is: true,
    then: () => object().required(),
    otherwise: () => object().nullable(),
  }),
  subject: string().required("Verplicht").min(2, "Minimaal 2 tekens"),
});

type Schema = InferType<typeof schema>;
type SchemaAndVendor = Omit<Schema, "vendor"> & { vendor: Vendor | null };

const issue = reactive<SchemaAndVendor>({
  hasVendor: true,
  vendor: null as Vendor | null,
  subject: "",
});

const loading = ref(false);
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<SchemaAndVendor>) {
  loading.value = true;

  const { data } = event

  try {
    console.log('Data is %o', data)
    const result = await $fetch('/api/issues', {
      method: 'POST',
      body: {
        title: data.subject,
        vendorId: data.vendor?.id ?? null,
      }
    })

    console.log("Result = %o", result);

    toast.add({
      color: "success",
      title: "Melding aangemaakt",
      description: "De melding is succesvol aangemaakt.",
    })
  } catch {
    toast.add({
      id: "create-issue-error",
      color: "error",
      title: "Melding aanmaken mislukt",
      description: "De melding kon niet worden aangemaakt.",
      duration: 0,
    })
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    title="Nieuwe melding"
    :description="modalDesc"
    class="w-175 max-w-[90vw]"
    :dismissible="false"
    :close="!loading"
  >
    <template #body>
      <LazyUForm
        :schema="schema"
        :state="issue"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="subject"
          label="Onderwerp"
          description="Waar gaat deze melding over?"
        >
          <UInput v-model="issue.subject"/>
        </UFormField>

        <UFormField
          v-if="issue.hasVendor"
          label="Standhouder"
          description="Welke standhouder is betrokken bij deze melding?"
          name="vendor"
        >
          <InputVendor v-model="issue.vendor"/>
        </UFormField>

        <UButton type="submit" :loading="loading">Melding aanmaken</UButton>
      </LazyUForm>
    </template>
  </UModal>
</template>

<style scoped></style>
