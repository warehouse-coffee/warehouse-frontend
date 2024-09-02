import React from 'react'

import DashboardMain from '@/components/Dashboard/DashboardMain'
import { ThemeProvider } from '@/components/ThemeProvider'

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