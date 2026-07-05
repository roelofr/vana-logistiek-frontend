<script setup lang="ts">
import type {Vendor, Location} from "~/types";
import {type InferType, object, string} from "yup";
import type {FormSubmitEvent} from "@nuxt/ui";
import type {UForm} from "#components";

const confetti = useConfetti();

const modalOpen = defineModel<boolean>("open", {default: false});
const modalDesc = ref<string | undefined>(undefined);

type IssueType = "standalone" | "with-vendor" | "with-location"

const subject = string().required("Verplicht").min(2, "Minimaal 2 tekens");
const issueType = string().required().oneOf<IssueType>(["standalone", "with-vendor", "with-location"])

const mainSchema = object({subject, issueType})
const vendorSchema = object({vendor: object<Vendor>().required()})
const locationSchema = object({location: object<Location>().required()})

const completeSchema = object({
  subject,
  issueType,
  vendor: object<Vendor>().when("issueType", {
    is: 'with-vendor',
    then: () => object<Vendor>().required(),
    otherwise: () => object<Vendor>().nullable(),
  }),
  location: object<Location>().when("issueType", {
    is: 'with-location',
    then: () => object<Location>().required(),
    otherwise: () => object<Location>().nullable(),
  }),
})

type MainSchema = InferType<typeof mainSchema>;
type CompleteSchema = MainSchema & { vendor: Vendor | null } & { location: Location | null };

const issue = reactive<CompleteSchema>({
  subject: "",
  issueType: "standalone",
  vendor: null as Vendor | null,
  location: null as Location | null,
});

const loading = ref(false);
const toast = useToast();

const currentPage = ref(1)
const isMap = computed(() => currentPage.value == 2 && issue.issueType == 'with-location')

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

const continueOrSubmit = async (event: Event) => {
  console.log("Continue or submit", issue, event);
  if (issue.issueType != 'standalone' && currentPage.value == 1) {
    event.stopPropagation();
    currentPage.value = 2
    return;
  }

  await submit();
}

const previous = () => {
  currentPage.value = 1;
}

const submit = async () => {
  const validData = await completeSchema.validate(issue, {abortEarly: true});
  if (!validData) {
    console.error("Invalid data", issue);
    return;
  }

  const data = validData as unknown as CompleteSchema;

  try {
    console.log('Data is %o', data)
    const result = await $fetch('/api/issues', {
      method: 'POST',
      body: {
        title: data.subject,
        vendorId: data.vendor?.id ?? null,
        location: data.location ?? null,
      }
    })

    console.log("Result = %o", result);

    toast.add({
      color: "success",
      title: "Melding aangemaakt",
      description: "De melding is succesvol aangemaakt.",
    })

    modalOpen.value = false;
    confetti.dispatch('normal')
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

function reset() {
  issue.subject = ""
  issue.issueType = "standalone"
  issue.vendor = null as Vendor | null
  issue.location = null as Location | null
  currentPage.value = 1
}

watch(modalOpen, (newVal, oldVal) => {
  if (! oldVal && newVal) {
    reset()
  }
})

</script>

<template>
  <UModal
    v-model:open="modalOpen"
    title="Nieuwe melding"
    :description="modalDesc"
    :class="{'w-175 max-w-[90vw]': !isMap}"
    :dismissible="false"
    :close="!loading"
    :fullscreen="isMap"
    @close="reset"
  >
    <template #body>
      <LazyUForm
        v-if="currentPage == 1"
        id="createIssueForm"
        :schema="mainSchema"
        :state="issue"
        class="space-y-4"
        @submit="continueOrSubmit">
        <UFormField
          name="subject"
          label="Onderwerp"
          description="Waar gaat deze melding over?"
        >
          <UInput v-model="issue.subject"/>
        </UFormField>

        <URadioGroup v-model="issue.issueType" variant="table" :items="typeItems"/>
      </LazyUForm>

      <LazyUForm
        v-else-if="currentPage == 2 && issue.issueType == 'with-vendor'"
        id="createIssueForm"
        :schema="vendorSchema"
        :state="issue"
        class="space-y-4"
        @submit="continueOrSubmit">
        <UFormField
          v-if="issue.issueType == 'with-vendor'"
          label="Standhouder"
          description="Welke standhouder is betrokken bij deze melding?"
          name="vendor"
        >
          <InputVendor v-model="issue.vendor"/>
        </UFormField>
      </LazyUForm>

      <LazyUForm
        v-else-if="currentPage == 2 && issue.issueType == 'with-location'"
        id="createIssueForm"
        :schema="vendorSchema"
        :state="issue"
        class="space-y-4 h-full flex flex-col grow"
        @submit="continueOrSubmit">
        <p>Selecteer de locatie van de melding, en klik rechtsonderin om te bevestigen.</p>
        <MapView v-model="issue.location" class="grow" type="picker"/>
      </LazyUForm>

      <template v-else>
        How did you get here?
      </template>

      <pre><code>{{ JSON.stringify(issue, undefined, 2) }}</code></pre>
    </template>

    <template #footer>
      <template v-if="currentPage == 1">
        <UButton
          type="submit"
          :loading="loading"
          form="createIssueForm"
          class="ml-auto">
          {{ issue.issueType == 'standalone' ? "Melding aanmaken" : "Volgende stap" }}
        </UButton>
      </template>
      <template v-else>
        <UButton
          :loading="loading"
          variant="soft"
          color="neutral"
          @click="previous"> Vorige stap
        </UButton>

        <UButton
          class="ml-auto"
          type="submit"
          form="createIssueForm"
          :loading="loading">
          Melding aanmaken
        </UButton>
      </template>
    </template>
  </UModal>
</template>

<style scoped></style>
