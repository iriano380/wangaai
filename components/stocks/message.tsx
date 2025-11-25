'use client'

import { IconGroq, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="group relative flex flex-col items-end w-full md:-ml-12">

      {/* Hora da mensagem */}
      <span className="text-[10px] text-gray-400 mb-1 pr-3">
        {time}
      </span>

      {/* Container mensagem + avatar */}
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

export function BotMessage({ content, className }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const text = useStreamableText(content)

  return (
    <div className="group relative flex flex-col items-start w-full md:-ml-12">

      {/* Hora em cima da mensagem */}
      <span className="text-[10px] text-gray-400 mb-1 ml-[35px]">
        {time}
      </span>

      <div className="flex items-start">
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
          <IconGroq />
        </div>

        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <MemoizedReactMarkdown ...>{text}</MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  )
}

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
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
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
