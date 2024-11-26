import type { Metadata } from 'next'
import React from 'react'

import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { DashboardPieChart } from '@/components/dashboard/dashboard-pie-chart'
import { DashboardTour } from '@/components/dashboard/dashboard-tour'
import { DashboardTrendingChart } from '@/components/dashboard/dashboard-trending-chart'
import { ROLE_NAMES } from '@/constants'
import { getUserRole } from '@/lib/auth'

import { TopOrders } from './top-orders'

export const metadata: Metadata = {
  title: 'Dashboard',
  icons: {
    icon: '/icon.png'
  }
}

export default async function DashboardPage() {
  const userRole = await getUserRole()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardTour userRole={userRole!} />

      <DashboardCards id="dashboard-cards" userRole={userRole!} />

      {(userRole === ROLE_NAMES.SUPER_ADMIN || userRole === ROLE_NAMES.ADMIN) && (
        <>
          <div className="md:col-span-2 lg:col-span-3">
            <DashboardTrendingChart id="dashboard-trending-chart" />
          </div>
          <DashboardPieChart id="dashboard-pie-chart" userRole={userRole!} />
        </>
      )}

      {userRole === ROLE_NAMES.EMPLOYEE && (
        <div className="md:col-span-2 lg:col-span-4">
          <TopOrders id="top-orders" />
        </div>
      )}
    </div>
  )
}