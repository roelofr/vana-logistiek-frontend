<script lang="ts" setup>
import { computed, ref } from "vue";
import type { IssueFilter, LoadingType } from "~/types";
import { breakpointsTailwind } from "@vueuse/core";

definePageMeta({
  key: "threads-index",
  middleware: ["auth"],
});

const router = useRouter();

const isPanelOpen = ref(false);
const activeFilter = ref<IssueFilter>("all");

const { activeIssue, issues, loadingState, fetch } = useIssueStore();

onMounted(() => {
  if (loadingState == LoadingState.Initial) fetch();
});


const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
</script>

<template>
  <UDashboardPanel
    id="inbox-1"
    :default-size="25"
    :max-size="30"
    :min-size="20"
    resizable
    :class="{
      'message-list': true,
      'message-list--mobile': isMobile,
      'message-list--with-message': activeIssue != null,
    }"
  >
    <UDashboardNavbar title="Meldingen">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-4">Hello World</div>
  </UDashboardPanel>

  <NuxtPage @close="router.push('/threads')">
    <div class="p-4">Hello World</div>
  </NuxtPage>

  <ClientOnly>
    <USlideover
      v-if="isMobile"
      v-model:open="isPanelOpen"
      @close="router.push('/threads')"
    >
      <template #content>
        <NuxtPage @close="router.push('/threads')">
          <ThreadsEmpty />
        </NuxtPage>
      </template>
    </USlideover>
  </ClientOnly>
</template>
