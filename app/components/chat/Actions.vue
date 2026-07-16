<script lang="ts" setup>
import type { ButtonProps, DropdownMenuItem } from "@nuxt/ui";
import type { Chat } from "~/types";
import { getModelColour } from "~/utils/model-utils";

const { chat } = defineProps<{ chat: Chat }>();

const emit = defineEmits<{ refresh: [] }>();

const confetti = useConfetti();
const { groups } = useGroups();

type PartialDropdown = Partial<
  Pick<DropdownMenuItem, "label" | "icon" | "disabled" | "onClick">
>;

const actions = computed(() => {
  const actions: PartialDropdown[] = [];

  if (chat.subject != null) {
    actions.push({
      label: "Markeer als opgelost",
      icon: "i-lucide-mail-check",
      disabled: chat.subject.resolvedAt != null,
      onClick: async () => {
        await $fetch(`/api/issues/${chat.subject!.id}/resolve`, {
          method: "POST",
        });
        emit("refresh");

        requestAnimationFrame(() => confetti.dispatch("done"));
      },
    });

    actions.push({
      label: "Heropenen",
      icon: "i-lucide-mail-warning",
      disabled: chat.subject.resolvedAt == null,
      onClick: async () => {
        await $fetch(`/api/issues/${chat.subject!.id}/reopen`, {
          method: "POST",
        });
        emit("refresh");

        requestAnimationFrame(() => confetti.dispatch("sad"));
      },
    });
  }

  return actions;
});

const addGroupOption = computed(
  () =>
    ({
      label: "Groep toevoegen",
      icon: "i-lucide-users-add",
      filter: { placeholder: "Zoek een groep" },
      children: groups.value
        ?.filter(
          (group) => !chat.groups.some((chatGroup) => chatGroup.id == group.id),
        )
        .map((group) => ({
          avatar: {
            icon: toLucideIcon(group.icon),
          },
          label: group.name,
          ui: {
            itemLeadingAvatar: getModelColour(group),
          },
          onClick: async () => {
            await $fetch(`/api/chats/by-id/${chat.id}/add-participants`, {
              method: "POST",
              body: [{ type: "group", id: group.id }],
            });

            emit("refresh");
          },
        })),
    }) satisfies DropdownMenuItem,
);

const menuDesktop = computed(() => [addGroupOption.value]);
const menuMobile = computed(() => [[actions.value], [addGroupOption.value]]);

const buttonItems = computed(() => {
  return actions.value
    .filter((a) => a.disabled !== false)
    .map(
      (row) =>
        ({
          color: "neutral",
          variant: "outline",
          ...row,
        }) satisfies Partial<ButtonProps>,
    );
});
</script>

<template>
  <div class="hidden items-center gap-2 lg:flex">
    <UButton v-for="item in buttonItems" :key="item.label" v-bind="item" />

    <UDropdownMenu
      :content="{
        side: 'bottom',
      }"
      :items="menuDesktop"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        color="neutral"
        icon="i-lucide-menu"
        label="Acties"
        variant="outline"
        :disabled="menuDesktop.length == 0"
      />
    </UDropdownMenu>
  </div>
  <UDropdownMenu
    class="lg:hidden"
    :content="{
      side: 'bottom',
    }"
    :items="menuMobile"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      color="neutral"
      icon="i-lucide-menu"
      label="Acties"
      variant="outline"
      :disabled="menuMobile.length == 0"
    />
  </UDropdownMenu>
</template>

<style scoped></style>
