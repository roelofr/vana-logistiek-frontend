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
  <UPageHeader title="Wijken" />

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="district in districts" :key="district.id" as="article">
      <template #header>
        <div class="flex items-center gap-4">
          <DistrictAvatar :district="district" size="lg" />
          <div>
            <h1 class="font-bold">{{ district.name }}</h1>
            <p class="text-sm text-muted">
              Beheerd door <GroupAvatar :group="district.group" size="2xs" />
              {{ district.group.name }}
            </p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 gap-2">
        <UPageFeature title="Wijkhouders" />

        <div
          v-if="district.users?.length > 0"
          class="grid grid-cols-2 border border-muted rounded p-4"
        >
          <UUser
            v-for="user in district.users"
            :key="user.id"
            :avatar="{}"
            :name="user.name"
          >
            <template #avatar>
              <UChip inset :show="user.atWork">
                <UserAvatar :user="user" single />
              </UChip>
            </template>
          </UUser>
        </div>
        <div v-else class="grid border border-muted rounded p-4">
          <p class="text-center italic text-sm">Geen wijkhouders bekend.</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
