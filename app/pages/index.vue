<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const confetti = useConfetti();

function pop() {
  confetti.dispatch(randomFrom(["dino", "gay", "normal"]));
}

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard title="Welkom">
          <p>
            Welkom in de app voor Logistiek. In deze app kan je tickets aanmaken
            voor standhouders, op locatie en gewoon dingen schreeuwen naar de
            Centrale Post van Logistiek en TBS.
          </p>
          <div class="p-4 mt-12">
            <UButton
              color="primary"
              size="xl"
              icon="i-lucide-party-popper"
              @click="pop"
              >Klik voor feest</UButton
            >
          </div>
        </UCard>
        <UCard title="Over je data" variant="soft">
          <p>
            De LogistiekApp is volledig in beheer van Roelof (hij rijdt nu
            waarschijnlijk rondjes op een Gator), dit geldt voor de hosting maar
            ook voor alle relevante data.
          </p>
          <p>Voor de volledigheid, dit is wat er met je data gebeurt:</p>

          <dl class="mt-8">
            <dt class="text-lg text-warning">
              Jouw persoonsgegevens (account, email)
            </dt>
            <dd class="ml-6 leading-relaxed">
              Staat opgeslagen via Hetzner in een datacenter in Helsinki,
              Finland.
            </dd>

            <dt class="text-lg text-warning">Jouw meldingen</dt>
            <dd class="ml-6 leading-relaxed">Staan op diezelfde server.</dd>

            <dt class="text-lg text-warning">
              Mailtjes van Troela Authenticatie en deze app
            </dt>
            <dd class="ml-6 leading-relaxed">
              Worden verstuurd via een mail-service gehost bij Scaleway, in
              Parijs
            </dd>

            <dt class="text-lg text-warning">Retentie</dt>
            <dd class="ml-6 leading-relaxed">
              We verwijderen je persoonsgegevens uit deze applicatie na afloop
              van Castlefest, ergens rond eind augustus. De inhoud van meldingen
              kan, indien vereist door Vana of een andere bevoegde partij,
              langer worden bewaard.<br />
              De titels van de meldingen bewaren we ongeveer een jaar, om voor
              volgend jaar nuttige voorbereiding te kunnen doen.
            </dd>
          </dl>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
