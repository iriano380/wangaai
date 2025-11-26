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
  const [apiKey, setApiKey] = useLocalStorage('groqKey', '')

  const [menuOpen, setMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const hasText = input.trim().length > 0

  return (
    <div className="fixed bottom-5 left-0 w-full flex justify-center px-4 sm:px-8 z-50">
      <form
        ref={formRef}
        onSubmit={async (e: any) => {
          e.preventDefault()
          if (window.innerWidth < 600) e.target['message']?.blur()

          const value = input.trim()
          setInput('')
          if (!value) return

          setMessages(current => [
            ...current,
            { id: nanoid(), display: <UserMessage>{value}</UserMessage> }
          ])

          const responseMessage = await submitUserMessage(value, apiKey)
          setMessages(current => [...current, responseMessage])
        }}
        className="w-full max-w-[720px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl 
        flex items-center gap-3 p-2 sm:p-3 border-4 border-[#F05237] animate-pulse-ia"
      >
        {/* BOTÃO + + MENU */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IconPlus
              className={`size-6 transition-transform duration-300 ${
                menuOpen ? 'rotate-45' : ''
              }`}
            />
          </Button>

          {/* MENU ANIMADO */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 bottom-16 bg-white dark:bg-gray-900 shadow-xl border rounded-xl p-3 w-48 flex flex-col gap-2 z-50"
              >
                {/* NOVO CHAT */}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/new')
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition text-left"
                >
                  <span dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path d="M2.5 7C2.5 9.48528 4.51472 11.5 7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7ZM2.5 17C2.5 19.4853 4.51472 21.5 7 21.5C9.48528 21.5 11.5 19.4853 11.5 17C11.5 14.5147 9.48528 12.5 7 12.5C4.51472 12.5 2.5 14.5147 2.5 17ZM12.5 17C12.5 19.4853 14.5147 21.5 17 21.5C19.4853 21.5 21.5 19.4853 21.5 17C21.5 14.5147 19.4853 12.5 17 12.5C14.5147 12.5 12.5 14.5147 12.5 17ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"></path></svg>
                  ` }} />
                  Novo Chat
                </button>

                {/* HISTÓRICO */}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/history')
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition text-left"
                >
                  <span dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05237" class="w-5 h-5">
                      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.298 22 8.69525 21.5748 7.29229 20.8248L2 22L3.17629 16.7097C2.42562 15.3063 2 13.7028 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 13.3347 4.32563 14.6181 4.93987 15.7664L5.28952 16.4201L4.63445 19.3663L7.58189 18.7118L8.23518 19.061C9.38315 19.6747 10.6659 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM13 7V12H17V14H11V7H13Z"></path></svg>
                  ` }} />
                  Histórico
                </button>

                {/* DEFINIÇÕES */}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/settings')
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition text-left"
                >
                  <span dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path d="M2 11.9998C2 11.1353 2.1097 10.2964 2.31595 9.49631C3.40622 9.55283 4.48848 9.01015 5.0718 7.99982C5.65467 6.99025 5.58406 5.78271 4.99121 4.86701C6.18354 3.69529 7.66832 2.82022 9.32603 2.36133C9.8222 3.33385 10.8333 3.99982 12 3.99982C13.1667 3.99982 14.1778 3.33385 14.674 2.36133C16.3317 2.82022 17.8165 3.69529 19.0088 4.86701C18.4159 5.78271 18.3453 6.99025 18.9282 7.99982C19.5115 9.01015 20.5938 9.55283 21.6841 9.49631C21.8903 10.2964 22 11.1353 22 11.9998C22 12.8643 21.8903 13.7032 21.6841 14.5033C20.5938 14.4468 19.5115 14.9895 18.9282 15.9998C18.3453 17.0094 18.4159 18.2169 19.0088 19.1326C17.8165 20.3043 16.3317 21.1794 14.674 21.6383C14.1778 20.6658 13.1667 19.9998 12 19.9998C10.8333 19.9998 9.8222 20.6658 9.32603 21.6383C7.66832 21.1794 6.18354 20.3043 4.99121 19.1326C5.58406 18.2169 5.65467 17.0094 5.0718 15.9998C4.48848 14.9895 3.40622 14.4468 2.31595 14.5033C2.1097 13.7032 2 12.8643 2 11.9998ZM12 14.9998C10.3431 14.9998 9 13.6567 9 11.9998C9 10.343 10.3431 8.99982 12 8.99982C13.6569 8.99982 15 10.343 15 11.9998C15 13.6567 13.6569 14.9998 12 14.9998Z"></path></svg>
                  ` }} />
                  Definições
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CAMPO DE TEXTO */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Digite a sua mensagem..."
          className="flex-1 resize-none bg-transparent px-4 py-1 text-base sm:text-lg 
          placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          minRows={1}
          maxRows={5}
        />

        {/* BOTÃO DE ENVIAR */}
        {hasText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#F05237] hover:bg-[#d43b1f] text-white shadow-lg transition-all"
              >
                <IconArrowDown className="rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        )}
      </form>

      {/* ANIMAÇÃO DA BORDA */}
      <style jsx>{`
        @keyframes pulse-border-ia {
          0%, 100% { border-color: #F05237; }
          50% { border-color: #FF8C6A; }
        }
        .animate-pulse-ia {
          animation: pulse-border-ia 1.2s infinite;
        }
      `}</style>
    </div>
  )
          }
