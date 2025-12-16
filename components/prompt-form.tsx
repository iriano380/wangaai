'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowDown, IconPlus } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { motion, AnimatePresence } from 'framer-motion'

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
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [apiKey] = useLocalStorage('groqKey', '')
  const [menuOpen, setMenuOpen] = React.useState(false)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const hasText = input.trim().length > 0

  return (
    <div className="fixed bottom-5 left-0 w-full flex justify-center px-4 sm:px-8 z-50">
      <div className="relative w-full max-w-[720px]">

        {/* MENU ALINHADO COM A BARRA */}
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
              {/* NOVO CHAT */}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/new')
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
              >
                <span dangerouslySetInnerHTML={{ __html: `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="w-5 h-5">
                    <path d="M16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"/>
                  </svg>
                ` }} />
                Novo Chat
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              {/* HISTÓRICO */}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/history')
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
              >
                <span dangerouslySetInnerHTML={{ __html: `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="w-5 h-5">
                    <path d="M12 8V13H16V15H10V8H12Z"/>
                  </svg>
                ` }} />
                Histórico
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              {/* DEFINIÇÕES */}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  router.push('/settings')
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
              >
                <span dangerouslySetInnerHTML={{ __html: `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="w-5 h-5">
                    <path d="M12 8.99982C10.3431 8.99982 9 10.343 9 11.9998C9 13.6567 10.3431 14.9998 12 14.9998C13.6569 14.9998 15 13.6567 15 11.9998C15 10.343 13.6569 8.99982 12 8.99982Z"/>
                  </svg>
                ` }} />
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
            setInput('')
            if (!value) return

            setMessages(m => [...m, {
              id: nanoid(),
              display: <UserMessage>{value}</UserMessage>
            }])

            const response = await submitUserMessage(value, apiKey)
            setMessages(m => [...m, response])
          }}
          className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
          rounded-2xl shadow-xl border-4 border-[#F05237]
          flex items-center gap-3 p-2 sm:p-3 animate-pulse-ia"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(v => !v)}
            className="rounded-full"
          >
            <IconPlus className={`size-6 transition-transform ${menuOpen ? 'rotate-45' : ''}`} />
          </Button>

          <Textarea
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Digite a sua mensagem..."
            className="flex-1 resize-none bg-transparent px-4 py-1 text-base
            focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={1}
          />

          {hasText && (
            <Button type="submit" size="icon"
              className="rounded-full bg-[#F05237] text-white">
              <IconArrowDown className="rotate-90" />
            </Button>
          )}
        </form>

        <style jsx>{`
          @keyframes pulse-border-ia {
            0%,100% { border-color:#F05237 }
            50% { border-color:#FF8C6A }
          }
          .animate-pulse-ia {
            animation: pulse-border-ia 1.2s infinite;
          }
        `}</style>
      </div>
    </div>
  )
                }
