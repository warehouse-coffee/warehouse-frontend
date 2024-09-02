'use client'

import React, { useState } from 'react'

import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar open={sidebarOpen} />
      <div className="flex-1 overflow-auto">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}