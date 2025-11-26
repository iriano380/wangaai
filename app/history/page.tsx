'use client'

import React from 'react'
import { useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HistoryPage() {
  const [messages] = useUIState<typeof AI>()
  const router = useRouter()

  const historyMessages = messages.filter(m => m.role !== 'system')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📜 Histórico de Conversas</h1>

      {historyMessages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Nenhuma conversa ainda.</p>
      ) : (
        <div className="space-y-4">
          {historyMessages.map(msg => (
            <div
              key={msg.id}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm opacity-60 mb-1">{msg.role === 'user' ? '👤 Você' : '🤖 IA'}</p>
              <div>{msg.display}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Button
          onClick={() => router.push('/')}
          className="bg-[#F05237] text-white px-6 py-2 rounded-xl hover:bg-[#d43b1f]"
        >
          ← Voltar ao Chat
        </Button>
      </div>
    </div>
  )
      }
