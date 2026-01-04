import type { UseFetchOptions } from 'nuxt/app'
import type { User } from '~/types'

declare type useUserOpts = Pick<UseFetchOptions<User>, 'lazy' | 'server'>

export const useUser = (opts: useUserOpts = {
  server: true,
}) => {
  const accessToken = useAccessToken()

  const http = useApi<User>('/api/users/me', {
    ...opts,
    watch: [accessToken],
  })

  return {
    data: http.data,
    user: http.data,
    pending: http.pending,
    status: http.status,
  }
}
