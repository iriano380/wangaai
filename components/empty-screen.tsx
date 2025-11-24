import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Bem vindo a WangaAI Gratuita!
        </h1>
        <p className="leading-normal text-sm">
          WangaAI combina tecnologia de ponta e conhecimento local para oferecer respostas precisas, criação de conteúdos e assistência inteligente em qualquer tarefa.{' '}
          <span className="font-muted-foreground">
            começe agora{' '}
            <ExternalLink href="https://sdk.vercel.ai">
              Inovaçao e cultura{' '}
            </ExternalLink>
            <ExternalLink href="https://tradingview.com">
              , i
            </ExternalLink>
            , Moçambicana{' '}
            <ExternalLink href="https://wangaai.vercel.app/new">
              ao seu alcançe
            </ExternalLink>
          </span>
        </p>
      </div>
    </div>
  )
}
