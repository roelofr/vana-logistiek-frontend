import type { Chat } from "~/types";
import type { AsyncDataRequestStatus } from "#app/composables/asyncData";
import { unpackDates } from "~/utils/date-util";

interface ChatResponse {
  chats: (Chat & {
    createdAt: string;
    updatedAt: string;
  })[];
}

interface ChatStore {
  data: Chat[];
  error: string | null;
  status: AsyncDataRequestStatus;
  lastSuccessfulFetch: null | number;
  pending: boolean;
}

const fetchChats = useFetch<ChatResponse>("/api/chats");

export const useChatStore = defineStore("chatStore", {
  state: (): ChatStore => ({
    data: [] as Chat[],
    error: null as string | null,
    status: "idle" as AsyncDataRequestStatus,
    lastSuccessfulFetch: null as null | number,
    pending: false,
  }),
  getters: {
    isLoading(state: ChatStore): boolean {
      return (
        state.status === "idle" ||
        (state.status === "pending" && state.lastSuccessfulFetch == null)
      );
    },
  },
  actions: {
    async fetch(): Promise<void> {
      if (this.pending) return;

      this.pending = true;
      this.status = "pending";

      console.log("Fetching data...");

      try {
        await fetchChats.execute();

        const data = fetchChats.data.value ?? { chats: [] };
        this.data = unpackDates(expand(data.chats, ["groups", "users"]), [
          "createdAt",
          "updatedAt",
        ]);
        this.status = "success";
        this.lastSuccessfulFetch = Date.now();
      } catch (error) {
        this.error = String(
          error instanceof Error ? error.message : "Unknown error",
        );
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
