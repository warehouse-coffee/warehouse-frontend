import type { Metadata } from 'next'
import React from 'react'

import { AuthWrapper } from '@/components/auth-wrapper'
import DashboardMain from '@/components/dashboard/dashboard-main'
import { ThemeProvider } from '@/components/theme-provider'

// import DashboardLoading from './loading'

export const metadata: Metadata = {
  title: 'Coffee Today | Dashboard',
  description: 'Coffee Today dashboard page'
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="dashboard-theme"
      enableSystem
    >
      <AuthWrapper>
        <DashboardMain>
          {children}
        </DashboardMain>
      </AuthWrapper>
    </ThemeProvider>
  )
}