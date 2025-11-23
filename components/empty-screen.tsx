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
          Chat Ai que iriano criou, com fins unicos de facilitar na coopreensaõ de criptomoedas.
          A IA não oferece ajuda para casos pessoais, e se lhe forem a ser feito perguntas do tipo poderá dar respostas bizaras.{' '}
          <span className="font-muted-foreground">
            começe agora{' '}
            <ExternalLink href="https://sdk.vercel.ai">
              uma nova converça...{' '}
            </ExternalLink>
            <ExternalLink href="https://tradingview.com">
              , sobre
            </ExternalLink>
            , criptomoedas{' '}
            <ExternalLink href="https://groq.com">
              100% totalmente gratuito
            </ExternalLink>
          </span>
        </p>
      </div>
    </div>
  )
}
