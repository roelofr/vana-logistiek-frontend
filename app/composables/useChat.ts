import type { ChatThread } from '~/types'

export function useChat() {
  const accessToken = useAccessToken()

  return useFetch<ChatThread>('/api/chat/threads', {
    method: 'GET',
    watch: [accessToken],
  })
}
