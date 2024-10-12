'use client'

import React, { useState, useEffect } from 'react'

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
        // console.error('Lỗi khi khởi tạo ứng dụng:', error)
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