import type { ChatThread } from '~/types'

export function useChat() {
  const { useSession } = useAuth()

  return useFetch<ChatThread>('/api/chat/threads', {
    method: 'GET',
    watch: [() => useSession().value.data],
  })
}
