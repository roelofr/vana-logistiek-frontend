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
        const response = await $fetch<Group[]>("/api/groups");
        if (!Array.isArray(response))
          throw new Error("Invalid response format");

        this.groups = response;
        this.state = "success";
      } catch (err) {
        this.state = "error";
        console.error("Failed to fetch groups:%o", err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
