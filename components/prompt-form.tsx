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
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [apiKey] = useLocalStorage('groqKey', '')
  const [menuOpen, setMenuOpen] = React.useState(false)

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

    // Aqui futuramente podes:
    // - enviar para API
    // - mostrar preview
    // - anexar ao prompt

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
            setInput('')
            if (!value) return

            setMessages(m => [
              ...m,
              { id: nanoid(), display: <UserMessage>{value}</UserMessage> }
            ])

            const response = await submitUserMessage(value, apiKey)
            setMessages(m => [...m, response])
          }}
          className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
          rounded-2xl shadow-xl border-4 border-[#F05237]
          flex items-center gap-2 p-2 sm:p-3 animate-pulse-ia"
        >
          {/* BOTÃO + */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(v => !v)}
            className="rounded-full"
          >
            <IconPlus className={`size-6 transition-transform ${menuOpen ? 'rotate-45' : ''}`} />
          </Button>

          {/* BOTÃO IMAGEM */}
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
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M14.4336 3C15.136 3 15.7869 3.36852 16.1484 3.9707L16.9209 5.25684C17.0113 5.40744 17.174 5.5 17.3496 5.5H19C20.6569 5.5 22 6.84315 22 8.5V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V8.5C2 6.84315 3.34315 5.5 5 5.5H6.65039C6.82602 5.5 6.98874 5.40744 7.0791 5.25684L7.85156 3.9707C8.21306 3.36852 8.86403 3 9.56641 3H14.4336Z" />
            </svg>
          </Button>

          {/* INPUT FILE INVISÍVEL */}
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
