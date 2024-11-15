import type { Metadata } from 'next'
import React from 'react'

import Providers from '@/app/providers'
import { Toaster } from '@/components/ui/sonner'
import { fontSans, fontItaliana } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import './globals.css'

export const metadata: Metadata = {
  title: 'Coffee Today',
  description: 'Coffee Today home page'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen relative bg-background text-foreground font-sans antialiased',
          fontSans.variable,
          fontItaliana.variable
        )}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}