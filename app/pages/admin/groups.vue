<script setup lang="ts">
import type { District, Group, User } from "~/types";

type SummaryUser = Pick<User, "id" | "name" | "avatar"> & {
  atWork: boolean;
};

type SummaryDistrict = Pick<District, "id" | "name" | "colour">;

type SummaryGroup = Pick<Group, "id" | "name" | "icon" | "colour"> & {
  districts: SummaryDistrict[];
  users: SummaryUser[];
};

type ExpandedSummaryGroup = SummaryGroup & {
  district: SummaryDistrict | undefined;
};

const { data: groups, refresh } = useLazyFetch<ExpandedSummaryGroup[]>(
  "/api/groups/summary",
  {
    transform: (data: SummaryGroup[]) =>
      data.map((group) => ({
        ...group,
        district: (group.districts ?? []).at(0),
        users: [
          ...group.users.filter((user) => user.atWork),
          ...group.users.filter((user) => !user.atWork),
        ],
      })),
  },
);
</script>

<template>
  <UPageHeader
    title="Groepen"
    description="Bekijk de groepen en wie er actief is"
  >
    <template #links>
      <GroupCreateModal @refresh="refresh()" />
    </template>
  </UPageHeader>

  <p class="mb-4 text-sm">
    Gebruikers kan je toevoegen aan een groep via "Gebruikers".
  </p>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="group in groups" :key="group.id" as="article">
      <template #header>
        <div class="flex items-center gap-4">
          <GroupAvatar :group="group" size="lg" />
          <div>
            <h1 class="font-bold">{{ group.name }}</h1>
            <p class="text-sm text-muted">
              <template v-if="group.district">
                Beheert wijk
                <DistrictAvatar :district="group.district" size="2xs" />
                {{ group.district.name }}.
              </template>
              <template v-else>Niet aan een wijk gekoppeld</template>
            </p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 gap-2">
        <div v-if="group.users.length" class="grid grid-cols-2">
          <UUser
            v-for="user in group.users"
            :key="user.id"
            :avatar="{}"
            :name="user.name"
          >
            <template #avatar>
              <div>
                <UChip :show="user.atWork" inset>
                  <UserAvatar :user="user" single />
                </UChip>
              </div>
            </template>
          </UUser>
        </div>

        <UEmpty
          v-else
          size="sm"
          :description="`${group.name} heeft nog geen leden.`"
        />
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
