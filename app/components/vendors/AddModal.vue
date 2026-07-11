<script lang="ts" setup>
import type { InferType } from "yup";
import { number, object, string } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { District, Vendor } from "~/types";

const router = useRouter();
const toast = useToast();

const schema = object({
  name: string()
    .min(2, "Naam moet 2 tekens zijn")
    .max(200, "Naam mag maximaal 200 tekens zijn"),
  number: string().required("Nummer is verplicht"),
  districtId: number().required("Wijk is verplicht"),
});
const open = ref(false);

type Schema = InferType<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  number: undefined,
  districtId: undefined,
});

const {
  data: districts,
  status,
  execute,
} = useFetch<District[]>("/api/districts", {
  lazy: false,
  immediate: false,
});

const mappedDistricts = computed(
  () =>
    districts.value?.map((district) => ({
      label: district.name,
      value: district.id,
    })) ?? [],
);

function onModalOpen() {
  if (status.value === "idle") execute();
}

watch(open, (newOpen) => newOpen && onModalOpen());

const confetti = useConfetti();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const vendor = await $fetch<Vendor>("/api/vendors/admin", {
    method: "POST",
    body: event.data,
  });

  toast.add({
    title: "Success",
    description: `Standhouder ${vendor.number} toegevoegd.`,
    color: "success",
  });

  confetti.dispatch("normal");

  await router.push(`/vendors/${vendor.id}`);
}
</script>

<template>
  <UModal
    v-model:open="open"
    description="Voeg een nieuwe standhouder toe"
    title="Nieuwe standhouder"
  >
    <UButton
      icon="i-lucide-plus"
      label="Standhouder"
      aria-label="Standhouder toevoegen"
    />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Naam" name="name" placeholder="John Doe">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Nummer" name="number" placeholder="123A">
          <UInput v-model="state.number" class="w-full" />
        </UFormField>

        <UFormField label="Wijk" name="district">
          <USelect
            v-model="state.districtId"
            placeholder="Selecteer een leuke wijk"
            :loading="status !== 'success'"
            :items="mappedDistricts"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            label="Annuleren"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            color="primary"
            label="Toevoegen"
            type="submit"
            variant="solid"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
