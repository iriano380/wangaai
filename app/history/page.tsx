"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ChatMessage } from "@/types/message"

export default function HistoryPage() {
  const router = useRouter()

  // carregando o histórico salvo
  let messages: ChatMessage[] = []

  if (typeof window !== "undefined") {
    const data = localStorage.getItem("history")
    messages = data ? JSON.parse(data) : []
  }

  // REMOVE mensagens do sistema
  const historyMessages = messages.filter(m => m.role !== "system")

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">

      <h1 className="text-2xl font-bold mb-4">Histórico</h1>

      {historyMessages.length === 0 && (
        <p className="text-gray-500">Nenhuma conversa ainda.</p>
      )}

      <div className="flex flex-col gap-4">
        {historyMessages.map(msg => (
          <div
            key={msg.id}
            className={`p-4 rounded-xl shadow bg-white dark:bg-gray-800`}
          >
            <p className="text-xs opacity-60 mb-1">
              {msg.role === "user" ? "Você" : "WangaAI"}
            </p>

            {/* Se existir display, usa ReactNode */}
            {msg.display ? (
              msg.display
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-6 underline"
      >
        Voltar ao chat
      </button>
    </div>
  )
            }
