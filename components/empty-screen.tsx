import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Bem vindo a WangaChat de Iriano!
        </h1>
        <p className="leading-normal text-sm">
          Chat Ai que iriano criou, com fins unicos de facilitar na coopreensaõ de criptomoedas
          TradingView stock market widgets.{' '}
          <span className="font-muted-foreground">
            Built with{' '}
            <ExternalLink href="https://sdk.vercel.ai">
              Vercel AI SDK{' '}
            </ExternalLink>
            <ExternalLink href="https://tradingview.com">
              , TradingView Widgets
            </ExternalLink>
            , and powered by{' '}
            <ExternalLink href="https://groq.com">
              Llama3-70b on Groq
            </ExternalLink>
          </span>
        </p>
      </div>
    </div>
  )
}
