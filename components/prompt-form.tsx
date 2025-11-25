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
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center px-4 sm:px-8 z-50">
      <form
        ref={formRef}
        onSubmit={async (e: any) => {
          e.preventDefault()
          if (window.innerWidth < 600) e.target['message']?.blur()
          const value = input.trim()
          setInput('')
          if (!value) return
          setMessages(currentMessages => [
            ...currentMessages,
            { id: nanoid(), display: <UserMessage>{value}</UserMessage> }
          ])
          const responseMessage = await submitUserMessage(value, apiKey)
          setMessages(currentMessages => [...currentMessages, responseMessage])
        }}
        className="w-full max-w-[700px] flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Botão de New Chat */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 m-1 rounded-full"
              onClick={() => router.push('/new')}
            >
              <IconPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>

        {/* Campo de texto */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Digite uma mensagem..."
          className="flex-1 min-h-[50px] max-h-[150px] resize-none bg-transparent px-4 py-3 focus:outline-none rounded-xl"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        {/* Botão de envio */}
        <div className="p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''} className="p-2 rounded-full">
                <IconArrowDown className="rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  )
}
