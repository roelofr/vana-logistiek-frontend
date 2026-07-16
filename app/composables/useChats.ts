import type { Chat } from "~/types";

interface ChatResponse {
  chats: (Chat & {
    createdAt: string;
    updatedAt: string;
  })[];
}

export function useChats() {
  const fetch = useFetch<Chat[]>("/api/chats", {
    key: "app-chats",
    transform: (response) =>
      ((response as unknown as ChatResponse).chats ?? ([] as Chat[]))
        .map(mapDates(["createdAt", "updatedAt"]))
        .map(expandMap(["groups", "users"])),
  });

  return { ...fetch, chats: fetch.data };
}
