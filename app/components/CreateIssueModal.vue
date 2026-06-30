<script setup lang="ts">
import type {Vendor} from "~/types";
import {type InferType, object, string} from "yup";
import type {FormSubmitEvent} from "@nuxt/ui";
import type {UForm} from "#components";

const modalOpen = defineModel<boolean>("open", {default: false});
const modalDesc = ref<string | undefined>(undefined);

type IssueType = "standalone" | "with-vendor" | "with-location"

const issueType = string().required().oneOf<IssueType>(["standalone", "with-vendor", "with-location"])

const mainSchema = object({
  subject: string().required("Verplicht").min(2, "Minimaal 2 tekens"),
  issueType,
})

const vendorSchema = object({
   issueType,
  vendor: object<Vendor>().required(),
})

const locationSchema = object({
  issueType,
  location: object<Location>().required(),
})

type MainSchema = InferType<typeof mainSchema>;

type SchemaAndVendor = MainSchema & { vendor: Vendor | null, location: Location | null };

const issue = reactive<SchemaAndVendor>({
  subject: "",
  issueType: "standalone",
  vendor: null as Vendor | null,
  location: null as Location | null,
});

const loading = ref(false);
const toast = useToast();

async function onSubmit() {
  loading.value = true;

  const data = issue;

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

const currentPage = ref(1)

const typeItems = [
  {
    value: 'standalone',
    label: 'Losse melding',
    description: 'Random happening'
  },
  {
    value: 'with-vendor',
    label: 'Met standhouder',
    description: 'Persoonlijke happening'
  },
  {
    value: 'with-location',
    label: 'Met locatie',
    description: 'Hyperlocale happening'
  },
]

const continueOrSubmit = (event: Event) => {
  console.log("Continue or submit", issue, event);
  if (issue.issueType == 'standalone')
    return;

  event.stopPropagation();
  currentPage.value = 2
}

function reset() {
  issue.subject = ""
  issue.issueType = "standalone"
  issue.vendor = null as Vendor | null
  issue.location = null as Location | null
  currentPage.value = 1
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
    @close="reset"
  >
    <template #body>
      <LazyUForm
        :state="issue"
        @submit="onSubmit"
      >
        <LazyUForm
          v-if="currentPage == 1"
          :schema="mainSchema"
          class="space-y-4"
          nested
          @submit="continueOrSubmit">
          <UFormField
            name="subject"
            label="Onderwerp"
            description="Waar gaat deze melding over?"
          >
            <UInput v-model="issue.subject"/>
          </UFormField>

          <URadioGroup v-model="issue.issueType" variant="table" :items="typeItems"/>

          <UButton type="submit" :loading="loading">
            {{ issue.issueType == 'standalone' ? "Melding aanmaken" : "Volgende stap" }}
          </UButton>
        </LazyUForm>

        <LazyUForm
          v-else-if="currentPage == 2 && issue.issueType == 'with-vendor'"
          :schema="vendorSchema"
          nested
          class="space-y-4">
          <UFormField
            v-if="issue.issueType == 'with-vendor'"
            label="Standhouder"
            description="Welke standhouder is betrokken bij deze melding?"
            name="vendor"
          >
            <InputVendor v-model="issue.vendor"/>
          </UFormField>

          <UButton type="submit" :loading="loading">Melding aanmaken</UButton>
        </LazyUForm>

        <template v-else-if="currentPage == 2 && issue.issueType == 'with-location'">
          <p>HIER KOMT DAN IETS VAN EEN KAART, POEHEE</p>

          <UButton type="submit" :loading="loading">Melding aanmaken</UButton>
        </template>

        <template v-else>
          How did you get here?
        </template>
      </LazyUForm>
    </template>
  </UModal>
</template>

<style scoped></style>
