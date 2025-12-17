'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUIState } from 'ai/rsc'
import { UserMessage } from '@/components/stocks/message'
import { getHistory } from '@/lib/chat/history'
import { AI } from 'ai'

export default function ChatPage() {
  const params = useParams()
  
  return (
    <AI>
      <ChatLoader chatId={params.id} />
    </AI>
  )
}

/* Componente separado para carregar as mensagens */
function ChatLoader({ chatId }: { chatId: string }) {
  const [_, setMessages] = useUIState()

  useEffect(() => {
    const chat = getHistory().find(c => c.id === chatId)
    if (!chat) return

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
