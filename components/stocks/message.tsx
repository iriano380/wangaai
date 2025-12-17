'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

import {
  IconGroq,
  IconUser,
  IconCopy,
  IconRefresh,
  IconCheck
} from '@/components/ui/icons'

// =====================
// USER MESSAGE
// =====================
export function UserMessage({ children }: { children: React.ReactNode }) {
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="group relative flex flex-col items-end w-full md:-ml-12">
      <span className="text-[10px] text-gray-400 mb-1 pr-3">{time}</span>

      <div className="flex items-start justify-end w-full">
        <div className="flex-1 flex justify-end pr-2">
          <div className="w-fit max-w-[80%] rounded-xl bg-[#ff5722] px-4 py-2 text-white shadow">
            {children}
          </div>
        </div>

        <div className="flex size-[25px] shrink-0 items-center justify-center rounded-md border bg-background shadow-sm ml-2">
          <IconUser />
        </div>
      </div>
    </div>
  )
}

// =====================
// BOT ACTIONS (APENAS IA)
// =====================
function BotActions({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-2 flex items-center gap-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
      <button onClick={handleCopy} title="Copiar">
        {copied ? (
          <IconCheck className="size-4 text-green-500" />
        ) : (
          <IconCopy className="size-4" />
        )}
      </button>

      <button title="Regenerar">
        <IconRefresh className="size-4" />
      </button>
    </div>
  )
}

// =====================
// BOT MESSAGE
// =====================
export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={cn('group relative flex flex-col items-start md:-ml-12', className)}>
      <span className="text-[10px] text-gray-400 mb-1 ml-[35px]">{time}</span>

      <div className="flex items-start">
        <div className="flex size-[24px] shrink-0 items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
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
                    language=""
                    value={String(children).replace(/\n$/, '')}
                  />
                )
              }
            }}
          >
            {text}
          </MemoizedReactMarkdown>

          {/* 👇 BOTÕES SÓ DA IA */}
          <BotActions text={text} />
        </div>
      </div>
    </div>
  )
}

// =====================
// SPINNER MESSAGE
// =====================
export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <IconGroq />
      </div>
      <div className="ml-4 h-[24px] flex items-center flex-1 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
