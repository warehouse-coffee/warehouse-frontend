import type { Metadata } from 'next'
import React from 'react'

import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Coffee Today | Login',
  description: 'Coffee Today login page'
}

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
      {children}
    </ThemeProvider>
  )
}