import type { Chat } from "~/types";

export interface ListChat extends Pick<
  Chat,
  | "id"
  | "title"
  | "type"
  | "state"
  | "subject"
  | "groups"
  | "users"
  | "createdAt"
  | "updatedAt"
> {
  unread: boolean;
}

interface ChatListResponse {
  statistics: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  chats: ListChat[];
}

export enum LoadingState {
  Initial,
  Update,
  Idle,
}

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    _isLoading: false,
    loadingState: LoadingState.Initial,
    chats: [] as ListChat[],
    unreadChats: [] as number[],
    activeChatId: null as number | null,
  }),
  getters: {
    activeChat(state): ListChat | null {
      return state.activeChatId !== null
        ? (state.chats.find((chat) => chat.id === state.activeChatId) ?? null)
        : null;
    },
  },
  actions: {
    async fetch() {
      // Check loading flag
      if (this._isLoading) return;
      this._isLoading = true;

      // Check if this might be a re-load
      if (this.loadingState == LoadingState.Idle)
        this.loadingState = LoadingState.Update;

      const { statistics, chats } =
        await $fetch<ChatListResponse>("/api/chats");

      console.log(
        "Recieved page %d / %d (%d chats)",
        statistics.currentPage,
        statistics.totalPages,
        statistics.totalItems,
      );
      console.log("Chats = %o", chats);

      const mappedChats = expand(chats, []).map((chat) => ({
        ...chat,
        read: true,
      }));

      console.log("Mapped Chats = %o", mappedChats);

      this.chats = mappedChats;

      this.unreadChats = mappedChats
        .filter((chat) => !chat.read)
        .map((chat) => chat.id);

      this.loadingState = LoadingState.Idle;
      this._isLoading = false;
    },

    setActiveChat(chat: number | Chat | ListChat | null) {
      if (chat === null) this.activeChatId = null;
      else if (typeof chat === "number") this.activeChatId = chat;
      else this.activeChatId = chat.id;
    },
  },
});
