export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatHistory = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
}

const KEY = 'chat-history'

export function getHistory(): ChatHistory[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export function saveHistory(history: ChatHistory[]) {
  localStorage.setItem(KEY, JSON.stringify(history))
}

export function createChat(firstMessage: string): ChatHistory {
  return {
    id: crypto.randomUUID(),
    title: firstMessage.slice(0, 40),
    messages: [{ role: 'user', content: firstMessage }],
    createdAt: Date.now()
  }
}

export function appendMessage(
  chatId: string,
  message: ChatMessage
) {
  const history = getHistory()
  const chat = history.find(c => c.id === chatId)
  if (!chat) return

  chat.messages.push(message)
  saveHistory(history)
}
