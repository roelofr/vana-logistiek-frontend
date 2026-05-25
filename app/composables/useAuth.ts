// composables/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthClient } from './useAuthClient'
import { computed, ref } from 'vue'
import type { Session, User } from 'better-auth'

interface BetterAuthSessionResponse {
  data: {
    user: User | null
    session: Session | null
  }
  error: null | {
    message: string
    status: number
    statusText: string
  }
  isPending: boolean
}

export function useAuth() {
  const client = useAuthClient()

  const {
    data: sessionData,
    status,
  } = useAsyncData<BetterAuthSessionResponse>('urn:local:session', async (): Promise<BetterAuthSessionResponse> => {
    const session = await client.useSession(useFetch)
    return {
      data: session.data.value,
      error: session.error.value,
      isPending: session.isPending,
    } as BetterAuthSessionResponse
  })

  // Reactive state
  const user = computed<User | null>(() => sessionData.value?.data.user ?? null)
  const session = computed<Session | null>(() => sessionData.value?.data.session ?? null)
  const isAuthenticated = computed<boolean>(() => user.value != null)
  const error = ref<string | null>(null)
  const isLoading = ref(true)

  const getUser = Promise.withResolvers<User | null>()
  const getSession = Promise.withResolvers<Session | null>()

  watch(status, (oldStatus, newStatus) => {
    if (newStatus === 'pending')
      isLoading.value = true
    if (oldStatus === 'pending' && ['error', 'success'].includes(newStatus)) {
      isLoading.value = false
    }
  })

  watch(() => sessionData.value?.error, (newError) => {
    if (newError) {
      error.value = newError.message ?? 'Unknown error'
    }
  })

  // Sign In (Pocket ID)
  const signIn = async () => {
    isLoading.value = true
    error.value = null

    try {
      return await client.signIn.oauth2({ providerId: 'pocket' })
    } catch (err) {
      error.value = (err instanceof Error ? err.message : null) ?? 'Sign in failed'
    } finally {
      isLoading.value = false
    }
  }

  // Sign Out
  const signOut = async () => {
    isLoading.value = true
    try {
      await client.signOut()
      // Optional: Redirect to home
      navigateTo('/')
    } catch (err: any) {
      error.value = err.message || 'Sign out failed'
    } finally {
      isLoading.value = false
    }
  }

  // Helper to check if logged in
  const useSession = () => client.useSession(useFetch)

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    getUser: getUser.promise,
    getSession: getSession.promise,
    useSession,
    signIn,
    signOut,
    // Expose raw client if you need advanced methods
    _client: client,
  }
}
