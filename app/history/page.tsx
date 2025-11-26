'use client'

import { useUIState } from 'ai/rsc'
import { type AI } from '@/lib/chat/actions'
import Link from 'next/link'

export default function HistoryPage() {
  const [messages] = useUIState<typeof AI>()

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Conversas</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">Nenhuma conversa ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className="p-3 border rounded-lg bg-white dark:bg-gray-900"
            >
              {typeof msg.display === 'string'
                ? msg.display
                : <div>{msg.display}</div>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
