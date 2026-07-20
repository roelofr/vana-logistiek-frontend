<script setup lang="ts">
import type { District, Group, User, Vendor } from "~/types";

const confetti = useConfetti();

type SummaryGroup = Pick<Group, "id" | "name" | "icon" | "colour">;

type SummaryVendor = Pick<Vendor, "id" | "number" | "name" | "type">;

type SummaryUser = Pick<User, "id" | "name" | "avatar"> & {
  atWork: boolean;
};

type SummaryDistrictProps = {
  group: SummaryGroup;
  vendors: SummaryVendor[];
  users: SummaryUser[];
};

type SummaryDistrict = Pick<District, "id" | "name"> &
  Pick<Group, "icon" | "colour"> &
  SummaryDistrictProps;

const { data: districts } = useLazyFetch<SummaryDistrict[]>(
  "/api/districts/summary",
);
</script>

<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="district in districts" :key="district.id" as="article">
      <template #header>
        <div class="flex items-center gap-4">
          <GroupAvatar :group="district" size="lg" />
          <div>
            <h2>{{ district.name }}</h2>
            <p class="text-muted">Beheerd door {{ district.group.name }}</p>
          </div>
        </div>
        <Placeholder class="h-8" />
      </template>

      <Placeholder class="h-32" />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
  </div>
</template>

<style scoped></style>
