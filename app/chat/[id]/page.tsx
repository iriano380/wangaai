'use client'

import { useEffect } from 'react'
import { useUIState } from 'ai/rsc'
import { useParams } from 'next/navigation'
import { getHistory } from '@/lib/chat/history'
import { UserMessage } from '@/components/stocks/message'

export default function ChatPage() {
  const params = useParams()
  const [_, setMessages] = useUIState()
  
  useEffect(() => {
    const chat = getHistory().find(c => c.id === params.id)
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
  }, [])

  return null
}
