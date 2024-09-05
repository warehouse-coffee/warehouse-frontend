import React from 'react'

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
      <DashboardMain>
        {children}
      </DashboardMain>
    </ThemeProvider>
  )
}