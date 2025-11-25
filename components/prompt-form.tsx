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

          // Adiciona a mensagem do utilizador
          setMessages(current => [
            ...current,
            { id: nanoid(), display: <UserMessage>{value}</UserMessage> }
          ])

          // Envia e adiciona a resposta da IA
          const responseMessage = await submitUserMessage(value, apiKey)
          setMessages(current => [...current, responseMessage])
        }}
        className="w-full max-w-[750px] flex items-center p-2 sm:p-3 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-900/90
          border-4 border-transparent animate-ia-border relative"
      >
        {/* Botão de novo chat */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() => router.push('/new')}
            >
              <IconPlus className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Novo chat</TooltipContent>
        </Tooltip>

        {/* Campo de texto */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Digite a sua mensagem..."
          className="flex-1 resize-none bg-transparent px-3 py-2 text-base sm:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none rounded-xl"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          minRows={1}
          maxRows={4} // altura reduzida
        />

        {/* Botão de envio (só aparece se tiver texto) */}
        {hasText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="ml-2 rounded-full bg-[#F05237] hover:bg-[#FF633E] text-white shadow-lg transition-all duration-200"
              >
                <IconArrowDown className="rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        )}

        {/* Efeito de brilho neon */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none animate-ia-glow"></div>
      </form>

      {/* CSS Animado */}
      <style jsx>{`
        @keyframes pulse-ia-border {
          0%, 100% { border-image-source: linear-gradient(90deg, #F05237, #FF8C6A); border-image-slice: 1; }
          50% { border-image-source: linear-gradient(90deg, #FF8C6A, #F05237); border-image-slice: 1; }
        }

        @keyframes glow-ia {
          0%, 100% { box-shadow: 0 0 10px #F05237, 0 0 20px #FF8C6A; }
          50% { box-shadow: 0 0 20px #F05237, 0 0 40px #FF8C6A; }
        }

        .animate-ia-border {
          border-style: solid;
          border-width: 4px;
          border-image-slice: 1;
          border-image-source: linear-gradient(90deg, #F05237, #FF8C6A);
          animation: pulse-ia-border 1.5s infinite;
        }

        .animate-ia-glow {
          border-radius: 1rem;
          animation: glow-ia 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
