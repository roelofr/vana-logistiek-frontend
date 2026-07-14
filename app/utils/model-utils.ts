import type { Chat } from "~/types";

export function getChatParticipants(chat: Chat): string {
  return [...chat.users, ...chat.groups].map((row) => row.name).join(", ");
}
