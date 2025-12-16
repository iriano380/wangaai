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
        className="w-full max-w-[720px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
        rounded-2xl shadow-xl flex items-center gap-3 p-2 sm:p-3 
        border-4 border-[#F05237] animate-pulse-ia"
      >

        {/* BOTÃO + */}
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

          {/* MENU */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 bottom-16 w-48 rounded-xl 
                bg-white dark:bg-gray-900 shadow-2xl border 
                p-3 flex flex-col z-50"
              >

                {/* ITEM */}
                <MenuItem
                  label="Novo Chat"
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/new')
                  }}
                  icon={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05237" class="w-5 h-5"><path d="M16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"/></svg>`}
                />

                <GlowDivider />

                <MenuItem
                  label="Histórico"
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/history')
                  }}
                  icon={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05237" class="w-5 h-5"><path d="M13 7V12H17V14H11V7H13Z"/></svg>`}
                />

                <GlowDivider />

                <MenuItem
                  label="Definições"
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/settings')
                  }}
                  icon={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05237" class="w-5 h-5"><path d="M12 8.99982C10.3431 8.99982 9 10.343 9 11.9998C9 13.6567 10.3431 14.9998 12 14.9998C13.6569 14.9998 15 13.6567 15 11.9998C15 10.343 13.6569 8.99982 12 8.99982Z"/></svg>`}
                />

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT */}
        <Textarea
          ref={inputRef}
          onKeyDown={onKeyDown}
          placeholder="Digite a sua mensagem..."
          className="flex-1 resize-none bg-transparent px-4 py-1 text-base sm:text-lg 
          placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none"
          spellCheck={false}
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          minRows={1}
          maxRows={5}
        />

        {/* ENVIAR */}
        {hasText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#F05237] hover:bg-[#d43b1f] 
                text-white shadow-lg transition-all"
              >
                <IconArrowDown className="rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        )}
      </form>

      {/* ESTILOS */}
      <style jsx>{`
        @keyframes pulse-border-ia {
          0%, 100% { border-color: #F05237; }
          50% { border-color: #FF8C6A; }
        }

        .animate-pulse-ia {
          animation: pulse-border-ia 1.2s infinite;
        }

        .glow-divider {
          height: 1px;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            #F05237,
            transparent
          );
          box-shadow: 0 0 6px #F05237;
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

/* COMPONENTES AUXILIARES */

function GlowDivider() {
  return <div className="glow-divider my-2" />
}

function MenuItem({
  label,
  onClick,
  icon
}: {
  label: string
  onClick: () => void
  icon: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 rounded-md 
      hover:bg-gray-200 dark:hover:bg-gray-800 transition text-left"
    >
      <span dangerouslySetInnerHTML={{ __html: icon }} />
      {label}
    </button>
  )
  }
