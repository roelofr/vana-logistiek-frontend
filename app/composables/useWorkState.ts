// composables/useWorkState.ts
import { FetchError } from "ofetch";
import type { UserMeDto } from "~/types";

export const useWorkState = () => {
  // 1. Initialize reactive state.
  // 'work-state' is the unique key. Default to false if not found in payload.
  const isAtWork = useState<boolean>("work-state", () => false);

  // Track loading and error states for UI feedback
  const isLoading = useState("work-state-loading", () => false);

  // Confetti!
  const confetti = useConfetti();

  // 2. Function to sync with server
  const setWorkStatus = async (newStatus: boolean) => {
    isLoading.value = true;

    try {
      // Optimistically update local state for instant UI feedback
      isAtWork.value = newStatus;

      await $fetch("/api/users/me/active", {
        method: "POST",
        body: { isActive: newStatus },
      });

      // If successful, the state remains as set optimistically

      // Fire off confetti!
      confetti.dispatch(newStatus ? "work-on" : "work-off");
    } catch (err) {
      // Revert on failure
      isAtWork.value = !newStatus;

      if (err instanceof FetchError && err.statusCode === 401)
        throw new Error(`Je bent niet meer ingelogd.`, err);
      if (err instanceof FetchError && err.status === 409)
        throw Error(`Er waren meerdere werk-mutaties tegelijkertijd.`, err);

      throw new Error("Bijwerken van werk-status mislukt.", err as Error);
    } finally {
      isLoading.value = false;
    }
  };

  // 3. Initial fetch (optional, if you need to ensure fresh data on mount)
  // Usually, the server renders the initial HTML with the correct state via nuxt.payload
  // But if you need to refresh it later:
  const refreshWorkStatus = async () => {
    try {
      const { data } = await useFetch<UserMeDto>("/api/users/me", {
        method: "GET",
        pick: ["flags"],
      });

      if (data.value)
        isAtWork.value = Boolean(data.value.flags?.includes("active"));
    } catch (e) {
      console.error("Failed to refresh work status", e);
    }
  };

  return {
    isAtWork,
    isLoading,
    setWorkStatus,
    refreshWorkStatus,
  };
};
