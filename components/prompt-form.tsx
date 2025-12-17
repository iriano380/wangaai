'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowDown, IconPlus } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { motion, AnimatePresence } from 'framer-motion'

/* Histórico */
import {
  createChat,
  appendMessage,
  getHistory
} from '@/lib/chat/history'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [apiKey] = useLocalStorage('groqKey', '')
  const [menuOpen, setMenuOpen] = React.useState(false)

  const [chatId, setChatId] = React.useState<string | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const hasText = input.trim().length > 0

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log('Imagem selecionada:', file)
  }

  return (
    <div className="fixed bottom-5 left-0 w-full flex justify-center px-4 sm:px-8 z-50">
      <div className="relative w-full max-w-[720px]">

        {/* MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-[calc(100%+12px)] left-0 w-full
              bg-white dark:bg-gray-900 border rounded-2xl shadow-xl
              p-3 flex flex-col gap-1"
            >
              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/new')
                }}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Novo Chat
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/history')
                }}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Histórico
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/settings')
                }}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Definições
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BARRA DE MENSAGEM */}
        <form
          ref={formRef}
          onSubmit={async e => {
            e.preventDefault()
            const value = input.trim()
            if (!value) return
            setInput('')

            setMessages(m => [
              ...m,
              { id: nanoid(), display: <UserMessage>{value}</UserMessage> }
            ])

            let currentChatId = chatId

            if (!currentChatId) {
              const chat = createChat(value)
              const history = getHistory()
              localStorage.setItem(
                'chat-history',
                JSON.stringify([chat, ...history])
              )
              currentChatId = chat.id
              setChatId(chat.id)
            } else {
              appendMessage(currentChatId, {
                role: 'user',
                content: value
              })
            }

            const response = await submitUserMessage(value, apiKey)

            setMessages(m => [...m, response])

            appendMessage(currentChatId!, {
              role: 'assistant',
              content:
                typeof response.display === 'string'
                  ? response.display
                  : response.display?.props?.children || ''
            })
          }}
          className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
          rounded-2xl shadow-xl border-4 border-[#F05237]
          flex items-center gap-2 p-2 sm:p-3 animate-pulse-ia"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(v => !v)}
            className="rounded-full"
          >
            <IconPlus
              className={`size-6 transition-transform ${
                menuOpen ? 'rotate-45' : ''
              }`}
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleImageClick}
            className="rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
            >
              <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
              <path d="M7 7l2-3h6l2 3" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <Textarea
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Digite a sua mensagem..."
            className="flex-1 resize-none bg-transparent px-4 py-1 text-base focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={1}
          />

          {hasText && (
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-[#F05237] text-white"
            >
              <IconArrowDown className="rotate-90" />
            </Button>
          )}
        </form>

        <style jsx>{`
          @keyframes pulse-border-ia {
            0%, 100% { border-color: #F05237; }
            50% { border-color: #FF8C6A; }
          }
          .animate-pulse-ia { animation: pulse-border-ia 1.2s infinite; }
        `}</style>
      </div>
    </div>
  )
                           }
