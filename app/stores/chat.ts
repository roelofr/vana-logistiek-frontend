import type { Chat } from "~/types";
import type { AsyncDataRequestStatus } from "#app/composables/asyncData";
import { unpackDates } from "~/utils/date-util";

interface ChatResponse {
  chats: Chat[];
}

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    data: [] as Chat[],
    error: null as Error | null,
    status: "idle" as AsyncDataRequestStatus,
    lastSuccessfulFetch: null as null | number,
    pending: false,
  }),
  actions: {
    async fetch(): Promise<void> {
      if (this.pending) return;

      this.pending = true;
      this.status = "pending";

      console.log("Fetching data...");

      try {
        const { chats } = await $fetch<ChatResponse>("/api/chats");
        this.data = unpackDates(expand(chats ?? [], ["groups", "users"]), [
          "createdAt",
          "updatedAt",
        ]);
        this.status = "success";
        this.lastSuccessfulFetch = Date.now();
      } catch (error) {
        this.error = error as Error;
        this.status = "error";
      } finally {
        this.pending = false;
      }
    },
    async fetchIfStale(): Promise<void> {
      const fetchAge = (Date.now() - (this.lastSuccessfulFetch ?? 0)) / 1000;
      console.info("Fetching if stale, %o", fetchAge > 300);

      if (fetchAge > 300) await this.fetch();
    },
    /**
     * Reload if already loaded.
     */
    async refresh(): Promise<void> {
      if (this.status !== "idle") await this.fetch();
    },
  },
});
