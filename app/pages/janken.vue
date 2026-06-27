<script setup lang="ts">
import {useSession} from "~/composables/useSession";

definePageMeta({
  middleware: ["auth"],
})

const { name, roles,email, avatar  } = useSession()

const session = computed(() => JSON.stringify({
  name: name.value,
  roles: roles.value,
  email: email.value,
  avatar: avatar.value,
}, undefined, 4))
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Devloper info" />
    </template>

    <template #body>
      <div class="grid grid-cols-2 gap-4">
        <UCard title="User info" class="w-full">
          <pre><code>{{ session }}</code></pre>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
