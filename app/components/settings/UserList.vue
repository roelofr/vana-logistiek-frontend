<script lang="ts" setup>
import type { SelectItem } from "@nuxt/ui";
import type { Group, User } from "~/types";
import { toLucideIcon } from "~/utils/string-util";

const { groups, users } = defineProps<{
  groups: Group[];
  users: User[];
}>();

const emit = defineEmits<{ refresh: [] }>();

const groupItems = computed<SelectItem[]>(() =>
  groups.map(
    (group) =>
      ({
        value: group.id,
        label: group.name,
        group: group,
        avatar: {
          icon: toLucideIcon(group.icon),
        },
      }) satisfies SelectItem,
  ),
);

const indexedGroupMap = computed(() => new Map(groups.map((g) => [g.id, g])));

const updatingUsers = ref<User[]>([]);
async function handeRoleChange(user: User, groupId: number | undefined | null) {
  const wantedGroup = groupId ? indexedGroupMap.value.get(groupId) : null;

  if (!wantedGroup) throw new Error("Group not found in indexedGroupMap");

  updatingUsers.value = [...updatingUsers.value, user];

  try {
    await $fetch(`/api/users/${user.id}/groups`, {
      method: "PATCH",
      body: {
        groups: wantedGroup ? [wantedGroup.id] : [],
      },
    });

    emit("refresh");
  } catch (e) {
    console.error("Failed to update user group", e);
  } finally {
    updatingUsers.value = updatingUsers.value.filter((x) => x.id != user.id);
  }
}
</script>

<template>
  <ul class="divide-y divide-default" role="list">
    <li
      v-for="(member, index) in users"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar size="md" :alt="member.name" :src="member.avatar" />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.roles }}
          </p>
        </div>
      </div>

      <div class="flex items-center grow gap-3">
        <USelect
          class="w-full"
          :model-value="member.group?.id"
          :items="groupItems"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
          color="neutral"
          :loading="updatingUsers.includes(member)"
          @update:model-value="
            handeRoleChange(member, $event as number | undefined)
          "
        >
          <template #leading="{ modelValue }">
            <template
              v-if="modelValue && indexedGroupMap.has(modelValue as number)"
            >
              <GroupAvatar
                :group="indexedGroupMap.get(modelValue as number)!"
                size="2xs"
              />
            </template>
          </template>
          <template #item-leading="{ item }">
            <GroupAvatar
              :group="indexedGroupMap.get(item!.value)!"
              size="2xs"
            />
          </template>
        </USelect>
      </div>
    </li>
  </ul>
</template>
