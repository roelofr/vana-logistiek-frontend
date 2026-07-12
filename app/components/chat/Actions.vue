<script lang="ts" setup>
import type { ButtonProps, DropdownMenuItem } from "@nuxt/ui";
import type { Chat } from "~/types";

const { chat } = defineProps<{ chat: Chat }>();

const emit = defineEmits<{ refresh: [] }>();

type PartialDropdown = Pick<
  DropdownMenuItem,
  "label" | "icon" | "disabled" | "onClick" | "color"
>;
const items = computed(() => {
  const actions: PartialDropdown[] = [];

  if (chat.subject != null) {
    actions.push({
      label: "Markeer als opgelost",
      icon: "i-lucide-mail-check",
      disabled: chat.subject.resolvedAt != null,
      onClick: async () => {
        await useFetch(`/api/issues/${chat.subject!.id}/resolve`, {
          method: "POST",
        });
        emit("refresh");
      },
    });

    actions.push({
      label: "Heropenen",
      icon: "i-lucide-mail-warning",
      disabled: chat.subject.resolvedAt == null,
      onClick: async () => {
        await useFetch(`/api/issues/${chat.subject!.id}/reopen`, {
          method: "POST",
        });
        emit("refresh");
      },
    });
  }

  return actions;
});

const buttonItems = computed(() => {
  return items.value
    .filter((a) => !a.disabled)
    .map(
      (row) =>
        ({
          color: "neutral",
          variant: "outline",
          ...row,
        }) satisfies ButtonProps,
    );
});
</script>

<template>
  <div class="hidden items-center gap-2 lg:flex">
    <UButton v-for="item in buttonItems" :key="item.label" v-bind="item" />
  </div>
  <UDropdownMenu
    class="lg:hidden"
    :content="{
      side: 'bottom',
    }"
    :items="items"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      color="neutral"
      icon="i-lucide-menu"
      label="Acties"
      variant="outline"
      :disabled="items.length == 0"
    />
  </UDropdownMenu>
</template>

<style scoped></style>
