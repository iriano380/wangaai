'use client'

import React from 'react'
import { useUIState } from 'ai/rsc'
import { type AI } from '@/lib/chat/actions'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const router = useRouter()
  const [messages] = useUIState<typeof AI>()

  // Filtra mensagens INCLUINDO role (mas teu sistema usa "display")
  const historyMessages = messages.filter(m => m.display)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Histórico de Conversas</h1>

      {historyMessages.length === 0 ? (
        <p className="opacity-70">Nenhuma conversa ainda.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {historyMessages.map(msg => (
            <div
              key={msg.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
            >
              {msg.display}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 rounded-md bg-[#F05237] text-white hover:bg-[#d43b1f]"
      >
        Voltar ao Chat
      </button>
    </div>
  )
}
