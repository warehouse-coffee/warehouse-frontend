import React, { Suspense } from 'react'

import { AuthWrapper } from '@/components/auth-wrapper'
import DashboardMain from '@/components/dashboard/dashboard-main'
import { ThemeProvider } from '@/components/theme-provider'

import DashboardLoading from './loading'

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
          <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
        </DashboardMain>
      </AuthWrapper>
    </ThemeProvider>
  )
}
