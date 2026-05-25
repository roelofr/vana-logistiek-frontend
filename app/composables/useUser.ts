import type { UseFetchOptions } from 'nuxt/app'
import type { User } from '~/types'
import { useAuth } from '~/composables/useAuth'

declare type useUserOpts = Pick<UseFetchOptions<User>, 'lazy' | 'server'>

export const useUser = (
  opts: useUserOpts = {
    server: true,
  },
) => {
  const { getAccessToken } = useAuth()

  const http = useApi<User>('/api/users/me', {
    ...opts,
    watch: [getAccessToken],
  })

  return {
    data: http.data,
    user: http.data,
    pending: http.pending,
    status: http.status,
  }
}
