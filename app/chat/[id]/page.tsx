'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUIState } from 'ai/rsc'
import { UserMessage } from '@/components/stocks/message'
import { getHistory } from '@/lib/chat/history'

export default function ChatPage() {
  const params = useParams()
  return <ChatLoader chatId={params.id} />
}

/* Componente que carrega as mensagens do chat histórico */
function ChatLoader({ chatId }: { chatId: string }) {
  const [_, setMessages] = useUIState()

  useEffect(() => {
    // Pega o chat do histórico pelo id
    const chat = getHistory().find(c => c.id === chatId)
    if (!chat) return

    // Popula o estado do chat com mensagens
    setMessages(
      chat.messages.map(m => ({
        id: crypto.randomUUID(),
        display:
          m.role === 'user'
            ? <UserMessage>{m.content}</UserMessage>
            : m.content
      }))
    )
  }, [chatId, setMessages])

  return null
}
