'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHistory } from '@/lib/chat/history'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Histórico</h1>

      {history.length === 0 && (
        <p className="text-gray-500">Sem conversas ainda.</p>
      )}

      <ul className="space-y-3">
        {history.map(chat => (
          <li key={chat.id}>
            <Link
              href={`/chat/${chat.id}`}
              className="block p-4 rounded-xl border
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <p className="font-medium">{chat.title}</p>
              <span className="text-xs text-gray-500">
                {new Date(chat.createdAt).toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
