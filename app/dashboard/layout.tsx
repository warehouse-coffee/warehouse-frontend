import React from 'react'

import { AuthWrapper } from '@/components/auth-wrapper'
import ChatBox from '@/components/chat'
import DashboardMain from '@/components/dashboard/dashboard-main'
import { ThemeProvider } from '@/components/theme-provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="dashboard-theme"
      enableSystem
    >
      <AuthWrapper>
        <ChatBox />
        <DashboardMain>{children}</DashboardMain>
      </AuthWrapper>
    </ThemeProvider>
  )
}