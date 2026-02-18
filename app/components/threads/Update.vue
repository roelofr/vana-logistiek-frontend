<script lang="ts" setup>
import type { ThreadUpdate } from '~/types'
import { localTime } from '~/utils'
import { useApiUrl } from '~/composables/useApiUrl'

const { updates } = defineProps<{
  updates: ThreadUpdate[]
}>()

const update = computed(() => updates[updates.length - 1]!)

const { resolve } = useApiUrl()
</script>

<template>
  <div
    v-if="update.type == 'System'"
    class="text-dimmed text-center leading-tight"
  >
    <template v-if="update.updateType == 'Created'">
      {{ update.message.split(update.user.name, 2)[0] }}
      <UserAvatar
        :team="update.team"
        :user="update.user"
        class="pe-1"
        size="xs"
      />
      {{ update.user.name + update.message.split(update.user.name, 2)[1] }}
    </template>
    <template v-else>
      {{ update.message }}
    </template>
  </div>
  <article v-else class="w-full scroll-mt-4 sm:scroll-mt-6">
    <div
      :class="{
        'ltr:justify-end ms-auto': update.me,
        'ltr:justify-start me-auto': !update.me,
      }"
      class="flex items-start max-w-[80%] gap-3"
    >
      <div class="min-h-6 mt-2">
        <UserAvatar
          v-if="!update.me"
          :team="update.team"
          :user="update.user"
          size="lg"
        />
      </div>
      <div
        :class="{
          'ltr:items-end': update.me,
          'ltr:items-start': !update.me,
        }"
        class="flex flex-col gap-y-1"
      >
        <template v-for="updateItem of updates" :key="updateItem.id">
          <template v-if="updateItem.type == 'Image'">
            <NuxtImg
              v-if="updateItem.update.fileReady"
              v-slot="{ src, isLoaded, imgAttrs }"
              :custom="true"
              :src="resolve(`/api/files/thread/${updateItem.thread.id}/image/${updateItem.id}/${updateItem.update.filename}.webp`)"
              loading="lazy"
            >
              <!-- Show the actual image when loaded -->
              <img
                v-if="isLoaded"
                :alt="`${updateItem.message} door ${updateItem.user.name}`"
                :src="src"
                class="min-w-0 bg-elevated/50 rounded-lg image"
                v-bind="imgAttrs"
              >

              <!-- Show skeleton otherwise -->
              <div class="relative">
                <USkeleton class="image bg-elevated/50 rounded-lg" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <UIcon class="animate-spin" name="i-lucide-loader-circle" size="lg" />
                </div>
              </div>
            </NuxtImg>
            <div
              v-else-if="updateItem.update.fileStatus == 'Corrupted'"
              class="text-pretty min-w-0 border border-error rounded-lg min-h-12 px-4 py-3 flex items-center gap-2"
            >
              <UIcon name="i-lucide-image-off" size="lg" />
              <span>Afbeelding beschadigd</span>
            </div>
            <div
              v-else
              class="text-pretty min-w-0 border border-accented rounded-lg min-h-12 px-4 py-3 flex items-center gap-2"
            >
              <UIcon class="animate-spin" name="i-lucide-loader" size="lg" />
              <span>Afbeelding verwerken...</span>
            </div>
          </template>
          <div
            v-else
            :class="{
              'bg-primary text-inverted': update.me,
              'bg-elevated/50': !update.me,
            }"
            class="text-pretty min-w-0 *:first:mt-0 *:last:mb-0 bg-elevated/50 rounded-lg min-h-12 px-4 py-3"
          >
            {{ updateItem.message }}
          </div>
        </template>
        <time class="text-sm text-muted">{{ localTime(update.date) }}</time>
      </div>
    </div>
  </article>
</template>

<style scoped>
.image {
  --image-height: 250px;
  height: var(--image-height);
  width: var(--image-height);
  max-height: var(--image-height);
  max-width: var(--image-height);
}

img.image {
  height: auto;
  width: auto;
}
</style>
