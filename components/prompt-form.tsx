"use client"

import * as React from "react"
import TextareaAutosize from "react-textarea-autosize"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSend } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function PromptForm({ onSubmit }: { onSubmit: (value: string) => void }) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const [input, setInput] = React.useState("")
  const [menuOpen, setMenuOpen] = React.useState(false)

  // ÍCONES SVG
  const icons = {
    newchat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 7C2.5 9.48528 4.51472 11.5 7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7ZM2.5 17C2.5 19.4853 4.51472 21.5 7 21.5C9.48528 21.5 11.5 19.4853 11.5 17C11.5 14.5147 9.48528 12.5 7 12.5C4.51472 12.5 2.5 14.5147 2.5 17ZM12.5 17C12.5 19.4853 14.5147 21.5 17 21.5C19.4853 21.5 21.5 19.4853 21.5 17C21.5 14.5147 19.4853 12.5 17 12.5C14.5147 12.5 12.5 14.5147 12.5 17ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"></path></svg>`,

    history: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.99982C6.47715 1.99982 2 6.477 2 11.9998H0L3 15.4998L6 11.9998H4C4 7.58158 7.58172 3.99982 12 3.99982C16.4183 3.99982 20 7.58158 20 11.9998C20 16.4181 16.4183 19.9998 12 19.9998C9.34784 19.9998 6.99646 18.7037 5.51472 16.656L3.85921 17.9285C5.6662 20.3819 8.65158 21.9998 12 21.9998C17.5228 21.9998 22 17.5227 22 11.9998C22 6.47696 17.5228 1.99982 12 1.99982ZM11 7.99982V12.4134L15.2929 16.7063L16.7071 15.2921L13 11.585V7.99982H11Z"></path></svg>`,

    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11.9998C2 11.1353 2.1097 10.2964 2.31595 9.49631C3.40622 9.55283 4.48848 9.01015 5.0718 7.99982C5.65467 6.99025 5.58406 5.78271 4.99121 4.86701C6.18354 3.69529 7.66832 2.82022 9.32603 2.36133C9.8222 3.33385 10.8333 3.99982 12 3.99982C13.1667 3.99982 14.1778 3.33385 14.674 2.36133C16.3317 2.82022 17.8165 3.69529 19.0088 4.86701C18.4159 5.78271 18.3453 6.99025 18.9282 7.99982C19.5115 9.01015 20.5938 9.55283 21.6841 9.49631C21.8903 10.2964 22 11.1353 22 11.9998C22 12.8643 21.8903 13.7032 21.6841 14.5033C20.5938 14.4468 19.5115 14.9895 18.9282 15.9998C18.3453 17.0094 18.4159 18.2169 19.0088 19.1326C17.8165 20.3043 16.3317 21.1794 14.674 21.6383C14.1778 20.6658 13.1667 19.9998 12 19.9998C10.8333 19.9998 9.8222 20.6658 9.32603 21.6383C7.66832 21.1794 6.18354 20.3043 4.99121 19.1326C5.58406 18.2169 5.65467 17.0094 5.0718 15.9998C4.48848 14.9895 3.40622 14.4468 2.31595 14.5033C2.1097 13.7032 2 12.8643 2 11.9998ZM12 14.9998C10.3431 14.9998 9 13.6567 9 11.9998C9 10.343 10.3431 8.99982 12 8.99982C13.6569 8.99982 15 10.343 15 11.9998C15 13.6567 13.6569 14.9998 12 14.9998Z"></path></svg>`
  }

  function sendMessage() {
    if (!input.trim()) return
    onSubmit(input)
    setInput("")
  }

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* MENU ABERTO */}
      {menuOpen && (
        <div className="absolute bottom-20 w-[95%] max-w-[750px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-4 flex flex-col gap-4 border border-gray-300 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          
          <a href="/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span dangerouslySetInnerHTML={{ __html: icons.newchat }} />
            <span className="text-base">Novo Chat</span>
          </a>

          <a href="/history" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span dangerouslySetInnerHTML={{ __html: icons.history }} />
            <span className="text-base">Histórico</span>
          </a>

          <a href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span dangerouslySetInnerHTML={{ __html: icons.settings }} />
            <span className="text-base">Definições</span>
          </a>
        </div>
      )}

      {/* FORM */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
        className="w-[95%] max-w-[750px] flex items-center gap-3 rounded-2xl p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm"
      >

        {/* Botão + */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <IconPlus className={`size-6 transition-transform ${menuOpen ? "rotate-45" : ""}`} />
        </Button>

        {/* Caixa de texto */}
        <TextareaAutosize
          value={input}
          onKeyDown={onKeyDown}
          onChange={(e) => setInput(e.target.value)}
          minRows={1}
          maxRows={6}
          placeholder="Escreva a sua mensagem…"
          className={cn(
            "w-full resize-none bg-transparent outline-none text-base px-2 py-1"
          )}
        />

        {/* Botão enviar */}
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-[#f55036] hover:bg-[#e2462f]"
        >
          <IconSend className="size-5" />
        </Button>

      </form>
    </div>
  )
}
