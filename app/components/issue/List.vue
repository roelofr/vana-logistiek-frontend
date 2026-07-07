<script setup lang="ts">
import { format, isToday } from "date-fns";
import type { Issue } from "~/types";

const props = defineProps<{
  issues: Issue[];
}>();

const issuesRefs = ref<Record<number, Element | null>>({});

const selectedIssue = defineModel<Issue | null>();

watch(selectedIssue, () => {
  if (!selectedIssue.value) {
    return;
  }
  const ref = issuesRefs.value[selectedIssue.value.id];
  if (ref) {
    ref.scrollIntoView({ block: "nearest" });
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = props.issues.findIndex(
      (issue: Issue) => issue.id === selectedIssue.value?.id,
    );

    if (index === -1) {
      selectedIssue.value = props.issues[0];
    } else if (index < props.issues.length - 1) {
      selectedIssue.value = props.issues[index + 1];
    }
  },
  arrowup: () => {
    const index = props.issues.findIndex(
      (issue: Issue) => issue.id === selectedIssue.value?.id,
    );

    if (index === -1) {
      selectedIssue.value = props.issues[props.issues.length - 1];
    } else if (index > 0) {
      selectedIssue.value = props.issues[index - 1];
    }
  },
});

const formatDate = (date: Date) => {
  try {
    return isToday(date) ? format(date, "HH:mm") : format(date, "dd MMM HH:mm");
  } catch {
    return "";
  }
};
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div v-if="!issues?.length" class="p-4">
      <UEmpty
        icon="i-lucide-inbox"
        title="Geen meldingen"
        description="Het lijkt er op dat er nog geen meldingen zijn binnengekomen, of je hebt ze allemaal weggefilterd."
      />
    </div>
    <div
      v-for="(issue, index) in issues"
      v-else
      :key="index"
      :ref="
        (el) => {
          issuesRefs[issue.id] = el as Element | null;
        }
      "
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          issue.read ? 'text-toned' : 'text-highlighted',
          selectedIssue && selectedIssue.id === issue.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        @click="selectedIssue = issue"
      >
        <div
          class="flex items-center justify-between"
          :class="{ 'font-semibold': !issue.read }"
        >
          <div class="flex items-center gap-3">
            {{ issue.vendor?.name ?? issue.user }}

            <UChip v-if="!issue.read" />
          </div>

          <span>{{ formatDate(issue.updatedAt) }}</span>
        </div>
        <p class="truncate" :class="{ 'font-semibold': !issue.read }">
          {{ issue.subject }}
        </p>
        <p class="text-dimmed line-clamp-1">Tagline</p>

        <pre><code class="text-wrap max-w-full">{{ JSON.stringify(issue, undefined , 2)}}</code></pre>
      </div>
    </div>
  </div>
</template>
