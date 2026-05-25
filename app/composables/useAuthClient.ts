// composables/useAuthClient.ts
import { createAuthClient } from 'better-auth/vue'
import { genericOAuthClient } from 'better-auth/client/plugins'

export const useAuthClient = () => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  return createAuthClient({
    fetchOptions: { headers },
    plugins: [
      genericOAuthClient(),
    ],
  })
}
