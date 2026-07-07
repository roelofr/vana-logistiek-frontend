<script setup lang="ts">
import type { ChatEntryGroup } from "~/types";

const { group } = defineProps<{ group: ChatEntryGroup }>();

const isMe = computed(() => group.isMe);
const avatarProps = computed(() => ({
  user: group.user!,
  group: group.group ?? undefined,
}));
</script>

<template>
  <div class="flex gap-2" :class="isMe ? 'flex-row-reverse' : 'flex-row'">
    <UserAvatar v-bind="avatarProps" class="flex-none" />
    <div
      class="flex flex-col gap-2"
      :class="isMe ? 'justify-end' : 'justify-start'"
    >
      <template v-for="entry of group.entries" :key="entry.id">
        <div v-if="entry.type == 'message'" class="bg-muted rounded p-2">
          {{ entry.message }}
        </div>
        <template v-else-if="entry.type == 'file'">
          <img
            v-if="entry.fileStatus == 'ready'"
            class="bg-muted rounded max-w-[80%] max-h-[300px]"
            :src="entry.url"
          />
          <UEmpty
            class="border border-muted rounded p-2"
            icon="i-lucide-file-x"
            description="Bijlage beschadigd"
          />
        </template>
        <template v-else-if="entry.type == 'location'">
          <MapView
            class="w-[80%] h-40"
            :interactive="false"
            :markers="[
              {
                name: '',
                lat: entry.latitude,
                lng: entry.longitude,
              },
            ]"
          />
        </template>
        <div v-else class="bg-muted rounded p-2">
          <em>Onbekend bericht</em>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
