'use client'

import { useUIState } from 'ai/rsc'
import { type AI } from '@/lib/chat/actions'

export default function HistoryPage() {
  const [messages] = useUIState<typeof AI>()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico de Conversas</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">Nenhuma conversa encontrada.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className="p-4 rounded-xl border bg-white dark:bg-gray-800 shadow-md"
            >
              {msg.display}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
