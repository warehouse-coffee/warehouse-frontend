import * as React from 'react'

import { ThemeProvider } from '@/components/ThemeProvider'

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
    </ThemeProvider>
  )
}