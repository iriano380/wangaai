// app/(lib)/chat/route.ts  (substitui o ficheiro existente)
import 'server-only'

import { generateText } from 'ai'
import {
  createAI,
  getMutableAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { createOpenAI } from '@ai-sdk/openai'

import { BotCard, BotMessage } from '@/components/stocks/message'

import { z } from 'zod'
import { nanoid } from '@/lib/utils'
import { SpinnerMessage } from '@/components/stocks/message'
import { Message } from '@/lib/types'
import { StockChart } from '@/components/tradingview/stock-chart'
import { StockPrice } from '@/components/tradingview/stock-price'
import { StockNews } from '@/components/tradingview/stock-news'
import { StockFinancials } from '@/components/tradingview/stock-financials'
import { StockScreener } from '@/components/tradingview/stock-screener'
import { MarketOverview } from '@/components/tradingview/market-overview'
import { MarketHeatmap } from '@/components/tradingview/market-heatmap'
import { MarketTrending } from '@/components/tradingview/market-trending'
import { ETFHeatmap } from '@/components/tradingview/etf-heatmap'
import { toast } from 'sonner'

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

interface MutableAIState {
  update: (newState: any) => void
  done: (newState: any) => void
  get: () => AIState
}

const MODEL = 'llama-3.3-70b-versatile'
const TOOL_MODEL = 'llama-3.3-70b-versatile'
const GROQ_API_KEY_ENV = process.env.GROQ_API_KEY

type ComparisonSymbolObject = {
  symbol: string;
  position: "SameScale";
};

// Sistema personalizado de WangaAI com informações do criador
const wangaSystemMessage = `
Você é WangaAI, a primeira IA completa moçambicana, criada em Vilankulo, Moçambique.
Seu criador é Iriano Gonçalves Chimanbane, da empresa IrianoCreative Studio.
O nome Wanga é em homenagem à irmã do criador, a última a nascer.
O criador nasceu em Vilankulo em 01 de Novembro de 2006, e seu número de contato é +258 859308902, você foi criado em janeiro de 2025 e foste lançado no dia 20 de novembro de 2025, e o que motivou o seu criador a te criar e porque ele precisava de alguém para lhe ajudar a trabalhar na tecnologia e te criou, tens 2 formas de te utilizar através do aplicativo e através do site no qual o endereço é https://www.wangachat.online.
Quando perguntado sobre seu criador, sua origem ou sua história, forneça essas informações de forma amigável e clara.
peça amigavelmente para que te sigam no Facebook sempre que te saudarem o link/endereço da sua página do Facebook que deve fornecer é https://www.facebook.com/profile.php?id=61584062139125.
Você é um assistente inteligente, prestativo e amigável, capaz de responder sobre diversos temas, incluindo educação, programação, cultura, notícias e mercado financeiro.
Quando o usuário pedir gráficos, preços ou notícias financeiras, utilize as ferramentas disponíveis para exibir os dados corretamente.
Sempre seja conciso, útil e educado.
`;

/**
 * generateCaption
 * Produz uma legenda curta para ferramentas financeiras usadas
 */
async function generateCaption(
  symbol: string,
  comparisonSymbols: ComparisonSymbolObject[],
  toolName: string,
  aiState: MutableAIState
): Promise<string> {
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: GROQ_API_KEY_ENV
  })
  
  const stockString = comparisonSymbols.length === 0
    ? symbol
    : [symbol, ...comparisonSymbols.map(obj => obj.symbol)].join(', ');

  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages]
  })

  const captionSystemMessage = wangaSystemMessage + `
Uma ferramenta foi usada (${toolName}). Produza uma legenda curta (1-3 frases) explicando o resultado da ferramenta de forma natural.
`

  try {
    const response = await generateText({
      model: groq(MODEL),
      messages: [
        {
          role: 'system',
          content: captionSystemMessage
        },
        ...aiState.get().messages.map((message: any) => ({
          role: message.role,
          content: message.content,
          name: message.name
        }))
      ]
    })
    return response.text || ''
  } catch (err) {
    return '' // falha silenciosa
  }
}

/**
 * submitUserMessage
 * Ação principal para envio de mensagens do usuário
 */
async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  try {
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: GROQ_API_KEY_ENV
    })

    const result = await streamUI({
      model: groq(TOOL_MODEL),
      initial: <SpinnerMessage />,
      maxRetries: 1,
      system: wangaSystemMessage,
      messages: [
        ...aiState.get().messages.map((message: any) => ({
          role: message.role,
          content: message.content,
          name: message.name
        }))
      ],
      text: ({ content, done, delta }) => {
        if (!textStream) {
          textStream = createStreamableValue('')
          textNode = <BotMessage content={textStream.value} />
        }

        if (done) {
          textStream.done()
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content
              }
            ]
          })
        } else {
          textStream.update(delta)
        }

        return textNode
      },
      tools: {
        // Ferramentas financeiras mantidas
        showStockChart: {
          description: 'Mostra um gráfico de ações.',
          parameters: z.object({
            symbol: z.string(),
            comparisonSymbols: z.array(z.object({
              symbol: z.string(),
              position: z.literal("SameScale")
            })).default([])
          }),
          generate: async function* ({ symbol, comparisonSymbols }) {
            yield <BotCard><></></BotCard>
            const toolCallId = nanoid()
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showStockChart', toolCallId, args: { symbol, comparisonSymbols } }] },
                { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showStockChart', toolCallId, result: { symbol, comparisonSymbols } }] }
              ]
            })
            const caption = await generateCaption(symbol, comparisonSymbols, 'showStockChart', aiState)
            return <BotCard><StockChart symbol={symbol} comparisonSymbols={comparisonSymbols} />{caption}</BotCard>
          }
        },
        showStockPrice: {
          description: 'Mostra preço de ações.',
          parameters: z.object({ symbol: z.string() }),
          generate: async function* ({ symbol }) {
            yield <BotCard><></></BotCard>
            const toolCallId = nanoid()
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showStockPrice', toolCallId, args: { symbol } }] },
                { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showStockPrice', toolCallId, result: { symbol } }] }
              ]
            })
            const caption = await generateCaption(symbol, [], 'showStockPrice', aiState)
            return <BotCard><StockPrice props={symbol} />{caption}</BotCard>
          }
        },
        showStockFinancials: {
          description: 'Mostra finanças de ações.',
          parameters: z.object({ symbol: z.string() }),
          generate: async function* ({ symbol }) {
            yield <BotCard><></></BotCard>
            const toolCallId = nanoid()
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showStockFinancials', toolCallId, args: { symbol } }] },
                { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showStockFinancials', toolCallId, result: { symbol } }] }
              ]
            })
            const caption = await generateCaption(symbol, [], 'showStockFinancials', aiState)
            return <BotCard><StockFinancials props={symbol} />{caption}</BotCard>
          }
        },
        showStockNews: {
          description: 'Mostra notícias financeiras.',
          parameters: z.object({ symbol: z.string() }),
          generate: async function* ({ symbol }) {
            yield <BotCard><></></BotCard>
            const toolCallId = nanoid()
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showStockNews', toolCallId, args: { symbol } }] },
                { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showStockNews', toolCallId, result: { symbol } }] }
              ]
            })
            const caption = await generateCaption(symbol, [], 'showStockNews', aiState)
            return <BotCard><StockNews props={symbol} />{caption}</BotCard>
          }
        },
        showStockScreener: {
          description: 'Mostra um stock screener genérico.',
          parameters: z.object({}),
          generate: async function* () {
            yield <BotCard><></></BotCard>
            const toolCallId = nanoid()
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showStockScreener', toolCallId, args: {} }] },
                { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showStockScreener', toolCallId, result: {} }] }
              ]
            })
            const caption = await generateCaption('Generic', [], 'showStockScreener', aiState)
            return <BotCard><StockScreener />{caption}</BotCard>
          }
        },
        // Mantém todas as demais ferramentas de mercado (overview, heatmap, ETF, trending)
        showMarketOverview: { description: '', parameters: z.object({}), generate: async function* () { yield <BotCard><></></BotCard>; const toolCallId = nanoid(); aiState.done({ ...aiState.get(), messages: [ ...aiState.get().messages, { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showMarketOverview', toolCallId, args: {} }] }, { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showMarketOverview', toolCallId, result: {} }] } ] }); const caption = await generateCaption('Generic', [], 'showMarketOverview', aiState); return <BotCard><MarketOverview />{caption}</BotCard> } },
        showMarketHeatmap: { description: '', parameters: z.object({}), generate: async function* () { yield <BotCard><></></BotCard>; const toolCallId = nanoid(); aiState.done({ ...aiState.get(), messages: [ ...aiState.get().messages, { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showMarketHeatmap', toolCallId, args: {} }] }, { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showMarketHeatmap', toolCallId, result: {} }] } ] }); const caption = await generateCaption('Generic', [], 'showMarketHeatmap', aiState); return <BotCard><MarketHeatmap />{caption}</BotCard> } },
        showETFHeatmap: { description: '', parameters: z.object({}), generate: async function* () { yield <BotCard><></></BotCard>; const toolCallId = nanoid(); aiState.done({ ...aiState.get(), messages: [ ...aiState.get().messages, { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showETFHeatmap', toolCallId, args: {} }] }, { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showETFHeatmap', toolCallId, result: {} }] } ] }); const caption = await generateCaption('Generic', [], 'showETFHeatmap', aiState); return <BotCard><ETFHeatmap />{caption}</BotCard> } },
        showTrendingStocks: { description: '', parameters: z.object({}), generate: async function* () { yield <BotCard><></></BotCard>; const toolCallId = nanoid(); aiState.done({ ...aiState.get(), messages: [ ...aiState.get().messages, { id: nanoid(), role: 'assistant', content: [{ type: 'tool-call', toolName: 'showTrendingStocks', toolCallId, args: {} }] }, { id: nanoid(), role: 'tool', content: [{ type: 'tool-result', toolName: 'showTrendingStocks', toolCallId, result: {} }] } ] }); const caption = await generateCaption('Generic', [], 'showTrendingStocks', aiState); return <BotCard><MarketTrending />{caption}</BotCard> } }
      }
    })

    return {
      id: nanoid(),
      display: result.value
    }
  } catch (err: any) {
    if (err.message.includes('OpenAI API key is missing.')) {
      err.message =
        'Groq API key is missing. Pass it using the GROQ_API_KEY environment variable. Try restarting the application if you recentemente alterou o ambiente.'
    }
    return {
      id: nanoid(),
      display: (
        <div className="border p-4">
          <div className="text-red-700 font-medium">Falha: {err.message}</div>
          <a
            href="https://chat.whatsapp.com/Gw0Op5BiRKMBplvNqUFZTq?mode=wwt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-red-800 hover:text-red-900"
          >
            Se a falha ainda continuar a ocorrer por favor , diga-nos no privado
            <span className="ml-1" style={{ textDecoration: 'underline' }}>
              Reportar no WhatsApp.
            </span>
          </a>
        </div>
      )
    }
  }
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] }
})
