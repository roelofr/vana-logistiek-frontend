<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { type InferType, object, string } from "yup";

definePageMeta({ auth: "guest", layout: "auth" });

const signInEmail = useSignIn("email");

async function login(email: string, password: string) {
  await signInEmail.execute(
    { email, password },
    { onSuccess: () => navigateTo("/app") },
  );
}

const toast = useToast();

const fields: AuthFormField[] = [
  {
    type: "text",
    name: "username",
    label: "Gebruikersnaam",
    autocomplete: "username",
    placeholder: "smith.69",
    required: true,
  },
  {
    type: "password",
    name: "password",
    label: "Wachtwoord",
    autocomplete: "current-password",
    placeholder: "Blubberjaar!23",
    required: true,
  },
];

const providers = [
  {
    label: "Passkey",
    icon: "i-lucide-fingerprint",
    onClick: () => {
      toast.add({ title: "Google", description: "Login with Google" });
    },
  },
];

const schema = object({
  email: string().required(),
  password: string()
    .required("Wachtwoord is verplicht")
    .min(10, "Minimaal 10 tekens"),
});

type Schema = InferType<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log("Submitted", payload);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>

<style scoped></style>
