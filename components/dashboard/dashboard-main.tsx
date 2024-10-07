'use client'

import React, { useState, useEffect } from 'react'

import { useAuth } from '@/hooks/useAuth'

import DashboardHeader from './dashboard-header'
import DashboardSidebar from './dashboard-sidebar'

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { initAuth } = useAuth()

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar open={sidebarOpen} />
      <div className="test flex-1 overflow-auto">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}