'use client'

import { ROLE_NAMES } from '@/constants'
import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { SystemHealthIndicator } from './system-health-indicator'

import { useStats } from '@/hooks/stats/useStats'

interface DashboardCardsProps {
  userRole: string | null
}

export function DashboardCards({ userRole }: DashboardCardsProps) {
  const { data: stats } = useStats()

  if (userRole === ROLE_NAMES.SUPER_ADMIN) {
    return (
      <>
        <Card >
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users across system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats?.totalUsers ?? 0} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>All products in warehouse system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats?.totalProducts ?? 0} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Errors</CardTitle>
            <CardDescription>Total errors in last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats?.totalErrors ?? 0} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <SystemHealthIndicator /> */}
          </CardContent>
        </Card>
      </>
    )
  }

  return null
}