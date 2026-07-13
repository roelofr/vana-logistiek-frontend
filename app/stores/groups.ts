import type { Group } from "~/types";

type LoadingState = "idle" | "loading" | "error" | "success";

export const useGroupStore = defineStore("groupStore", {
  state: () => ({
    isLoading: false,
    state: "idle" as LoadingState,
    groups: [] as Group[],
  }),
  actions: {
    async fetch() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.state = "loading";

      try {
        this.groups = await $fetch<Group[]>("/api/groups");
        this.state = "success";
      } finally {
        this.isLoading = false;
        this.state = "error";
      }
    },
  },
});
