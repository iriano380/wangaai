'use client'

import * as React from 'react'
import { IconGroq, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import {
  Copy,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

/* ======================================================
   AÇÕES DA MENSAGEM DA IA (copiar, regenerar, etc.)
   ====================================================== */

function BotActions({ text }: { text: string }) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="mt-2 flex items-center gap-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={copyToClipboard}
        className="hover:text-gray-600 dark:hover:text-gray-300"
        title="Copiar"
      >
        <Copy size={14} />
      </button>

      <button
        className="hover:text-gray-600 dark:hover:text-gray-300"
        title="Regenerar"
      >
        <RefreshCcw size={14} />
      </button>

      <button
        className="hover:text-green-500"
        title="Gostei"
      >
        <ThumbsUp size={14} />
      </button>

      <button
        className="hover:text-red-500"
        title="Não gostei"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  )
}

/* ======================================================
   MENSAGEM DO USUÁRIO (NÃO ALTERADA)
   ====================================================== */

export function UserMessage({ children }: { children: React.ReactNode }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="group relative flex flex-col items-end w-full md:-ml-12">
      <span className="text-[10px] text-gray-400 mb-1 pr-3">
        {time}
      </span>

      <div className="flex items-start justify-end w-full">
        <div className="flex-1 flex justify-end pr-2">
          <div className="w-fit max-w-[80%] rounded-xl bg-[#ff5722] px-4 py-2 text-white shadow">
            {children}
          </div>
        </div>

        <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm ml-2">
          <IconUser />
        </div>
      </div>
    </div>
  )
}

/* ======================================================
   MENSAGEM DA IA (COM AÇÕES)
   ====================================================== */

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={cn('group relative flex flex-col items-start md:-ml-12', className)}>
      <span className="text-[10px] text-gray-400 mb-1 ml-[35px]">
        {time}
      </span>

      <div className="flex items-start">
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
          <IconGroq />
        </div>

        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return <span className="mt-1 animate-pulse cursor-default">▍</span>
                  }
                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {text}
          </MemoizedReactMarkdown>

          {/* AÇÕES DA IA (como na imagem) */}
          <BotActions text={typeof text === 'string' ? text : ''} />
        </div>
      </div>
    </div>
  )
}

/* ======================================================
   OUTROS COMPONENTES (SEM ALTERAÇÃO)
   ====================================================== */

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconGroq />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
      <div className="max-w-[600px] flex-initial p-2">{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <IconGroq />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
  }
