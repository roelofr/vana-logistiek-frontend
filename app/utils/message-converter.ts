import type { ChatEntry, ChatEntryGroup } from "~/types";

function getMyId() {
  const { user } = useOidcAuth();

  return (user.value?.userInfo?.sub ?? null) as string | null;
}

export function groupChatMessages(chatEntries: ChatEntry[]): ChatEntryGroup[] {
  return chatEntries
    .map(mapToGroups.bind(undefined, getMyId()))
    .reduce(mergeGroups, [] as ChatEntryGroup[]);
}

function mapToGroups(userId: string | null, entry: ChatEntry): ChatEntryGroup {
  return {
    id: entry.groupingKey ?? crypto.randomUUID(),
    role: "user",
    isMe: Boolean(entry.user && entry.user.providerId == userId),
    user: entry.user,
    group: entry.group,
    entries: [entry],
  };
}

function mergeGroups(
  previous: ChatEntryGroup[],
  current: ChatEntryGroup,
): ChatEntryGroup[] {
  if (previous.length == 0) return [current];

  const lastNode = previous.at(-1)!;
  if (lastNode.id == current.id) {
    lastNode.entries = lastNode.entries.concat(current.entries);
    return previous;
  }

  return [...previous, current];
}
