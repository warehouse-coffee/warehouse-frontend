'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import PageLoading from '@/components/page-loading'
import { useAuth } from '@/hooks/useAuth'

import DashboardHeader from './dashboard-header'
import DashboardSidebar from './dashboard-sidebar'

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const { userInfo, logout } = useAuth()

  const handleLogout = async () => {
    try {
      setLoading(true)
      const success = await logout(userInfo?.userId || '')
      if (success) {
        toast.success('Logged out successfully')
      }
    } catch (error) {
      toast.error('Failed to log out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <DashboardSidebar open={sidebarOpen} />
      <div className="flex-1 overflow-auto">
        <DashboardHeader
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
      {loading && <PageLoading loadingText="Logging out..." />}
    </div>
  )
}