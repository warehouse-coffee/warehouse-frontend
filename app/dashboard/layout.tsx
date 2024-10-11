'use client'

// import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import DashboardMain from '@/components/dashboard/dashboard-main'
import DashboardPreloader from '@/components/dashboard/dashboard-preloader'
import { ThemeProvider } from '@/components/theme-provider'
// import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  // const { checkAuth } = useAuth()
  // const router = useRouter()

  useEffect(() => {
    const initializeApp = () => {
      return new Promise<void>((resolve, reject) => {
        resolve()
      })
    }

    initializeApp()
      .then(() => {
        setIsLoading(false)
      })
      .catch((error: Error) => {
        // console.error('Lỗi khi khởi tạo ứng dụng:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
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