'use client'

import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROLE_NAMES } from '@/constants'
import { useGetStats } from '@/hooks/stats/useGetStats'

interface DashboardCardsProps {
  userRole: string | null
}

export function DashboardCards({ userRole }: DashboardCardsProps) {
  const { data: stats } = useGetStats()

  if (userRole === ROLE_NAMES.SUPER_ADMIN) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users across system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats?.totalUser ?? 0} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Companies</CardTitle>
            <CardDescription>All companies registered in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats?.totalCompany ?? 0} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
            <CardDescription>Current CPU usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.cpu}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RAM Usage</CardTitle>
            <CardDescription>Current RAM usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.ram}%</p>
          </CardContent>
        </Card>
      </>
    )
  }

  return null
}