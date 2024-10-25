'use client'

import React from 'react'

import DashboardPreloader from '@/components/dashboard/dashboard-preloader'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/auth-store'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuth()
  const isChecked = useAuthStore((state) => state.isChecked)

  if (!isChecked) {
    return <DashboardPreloader />
  }

  return <>{children}</>
}
