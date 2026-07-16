import type { Group } from "~/types";

export function useGroups() {
  const fetch = useFetch<Group[]>("/api/groups", {
    key: "app-groups",
  });

  return { ...fetch, groups: fetch.data };
}
