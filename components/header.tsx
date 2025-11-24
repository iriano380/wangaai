import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconGroq,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { Session } from '@/lib/types'

async function UserOrLogin() {
  return (
    <>
      <Link href="https://wow.groq.com/groq-labs/" rel="nofollow">
        {/* <IconGroq className="size-6 mr-2 dark:hidden" />
          <IconGroq className="hidden size-6 mr-2 dark:block" /> */}
        <Image
          src="/groqlabs-logo-black.png"
          alt="GroqLabs Logo"
          width={100}
          height={30}
        />
      </Link>

      <div className="flex items-center font-semibold">
        <a href="https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00PCY3US44"></a>
        
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://chat.whatsapp.com/Gw0Op5BiRKMBplvNqUFZTq?mode=wwt"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'ghost' }))}
          style={{ borderRadius: 0 }}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">Reportar erro</span>
        </a>
      </div>
    </header>
  )
}
