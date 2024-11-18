import React from 'react'

import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { DashboardPieChart } from '@/components/dashboard/dashboard-pie-chart'
import { DashboardTrendingChart } from '@/components/dashboard/dashboard-trending-chart'
import { getUserRole } from '@/lib/auth'

export default async function DashboardPage() {
  const userRole = await getUserRole()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCards userRole={userRole!} />
      <div className="md:col-span-2 lg:col-span-3">
        <DashboardTrendingChart id="dashboard-trending-chart" />
      </div>
      <DashboardPieChart id="dashboard-pie-chart" />
    </div>
  )
}