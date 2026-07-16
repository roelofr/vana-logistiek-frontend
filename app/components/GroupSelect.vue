<script setup lang="ts">
import type { SelectValue } from "@nuxt/ui/components/Select.vue";
import type { Group } from "~/types";
import type { SelectItem } from "@nuxt/ui";
import { toLucideIcon } from "~/utils/string-util";

const publicValue = defineModel<Group | undefined>();

const { groups, pending: groupItemsLoading } = useGroups();

const keyedGroups = computed<Map<number, Group>>(
  () => new Map(groups.value?.map((g) => [g.id, g]) ?? []),
);

const groupItems = computed<SelectItem[]>(
  () =>
    groups.value?.map(
      (group) =>
        ({
          value: group.id,
          label: group.name,
          group: group,
          avatar: {
            icon: toLucideIcon(group.icon),
          },
        }) satisfies SelectItem,
    ) ?? [],
);

const innerValue = computed<number | undefined>({
  get: () => publicValue.value?.id,
  set: (value) => {
    if (!value) publicValue.value = undefined;
    else publicValue.value = keyedGroups.value.get(value)!;
  },
});
</script>

<template>
  <USelect
    v-model="innerValue"
    class="w-full"
    :loading="groupItemsLoading && !keyedGroups"
    :items="groupItems"
    :ui="{ value: 'capitalize', item: 'capitalize' }"
    color="neutral"
  >
    <template #leading="{ modelValue }">
      <template v-if="modelValue && keyedGroups.has(modelValue as number)">
        <GroupAvatar
          :group="keyedGroups.get(modelValue as number)!"
          size="2xs"
        />
      </template>
    </template>

    <template #item-leading="{ item }">
      <GroupAvatar
        :group="
          keyedGroups.get((item as { value: SelectValue }).value as number)!
        "
        size="2xs"
      />
    </template>
  </USelect>
</template>

<style scoped></style>
