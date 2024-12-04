'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import React from 'react'

import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const DotPattern = dynamic(() => import('@/components/magicui/dot-pattern'), { ssr: false })

interface AuthLayoutProps {
  children: React.ReactNode
}

/**
 * AuthLayout component
 * Renders the main layout for auth pages including the navbar and children content
*/

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="auth-theme"
    >
      <main className="w-full min-h-screen overflow-hidden rounded-md bg-neutral-950 relative flex flex-col items-center justify-center">
        <DotPattern
          className={cn(
            '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
          )}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </ThemeProvider>
  )
}