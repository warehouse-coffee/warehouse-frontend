'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

import DashboardMain from '@/components/dashboard/dashboard-main'
import DashboardPreloader from '@/components/dashboard/dashboard-preloader'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const { initAuth } = useAuth()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initAuth()
      } catch (error) {
        toast.error('Failed to initialize app')
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="dashboard-theme"
      enableSystem
    >
      {isLoading ? (
        <DashboardPreloader />
      ) : (
        <DashboardMain>
          {children}
        </DashboardMain>
      )}
    </ThemeProvider>
  )
}