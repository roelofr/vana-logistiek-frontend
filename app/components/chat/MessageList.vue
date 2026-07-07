<script setup lang="ts">
import type {Chat, ChatEntry, User} from "~/types";

const {chat} = defineProps<{ chat: Chat }>();
const { user } = useOidcAuth();

const {data: messages} = useLazyFetch<ChatEntry[]>(`/api/chats/by-id/${chat.id}/entries`)

/*
"id": 1,
"chat": {
  "id": 3
},
"createdAt": "2026-07-06T22:55:22.135325",
"updatedAt": "2026-07-06T22:55:22.135342",
"groupingKey": "90b67b68-b957-4129-97e9-b3dcf5081cde",
"user": {
  "id": 1,
  "providerId": "394e2a58-d8cc-44f4-84e6-0705c24e9e7b",
  "name": "Roelof Roos",
  "avatar": "https://login.troela.fun/api/users/394e2a58-d8cc-44f4-84e6-0705c24e9e7b/profile-picture.png"
},
"group": null,
"message": "Wat doms!",
"type": "message"
 */

watch(() => user.value, v => console.log(v))

function isMe(targetUser: User | null) {
  return (targetUser != null && targetUser.providerId == user.value?.userInfo?.sub);
}

const chatMessages = computed(() => {
  const messagesValue = messages.value;
  if (! messagesValue)
    return [];

  const groups = [];
  let grouping: string | null = null;
  let grouped = null;

  messagesValue.forEach(message => {
    if (!grouping || message.groupingKey !== grouping) {
      grouping = message.groupingKey;
      grouped = {
        id: message.groupingKey,
        role: 'user',
        avatar: message.user?.avatar,
        side: isMe(message.user) ? 'right' : 'left',
        parts: []
      }

      groups.push(grouped)
    }

    if (message.type === 'message')
    grouped.parts.push({
      type: 'text',
      mesage: message.message,
    })
  })

  return groups;
})

</script>

<template>
  <UChatMessages :messages="chatMessages" />
  <DevOnly>
    <pre><code>{{ JSON.stringify(messages, undefined, 2) }}</code></pre>
    <pre><code>{{ JSON.stringify(chatMessages, undefined, 2)}}</code></pre>
  </DevOnly>
</template>

<style scoped>

</style>
