'use client'

import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ROLE_NAMES } from '@/constants'
import { useGetStats, isSuperAdminStats, isAdminStats, isEmployeeStats } from '@/hooks/stats/useGetStats'

interface DashboardCardsProps {
  userRole: string | null
}

export function DashboardCards({ userRole }: DashboardCardsProps) {
  const { data: stats } = useGetStats(userRole)

  if (userRole === ROLE_NAMES.SUPER_ADMIN && isSuperAdminStats(stats)) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users across system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.totalUser} />
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
              <NumberTicker value={stats.totalCompany} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
            <CardDescription>Current CPU usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.cpu}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RAM Usage</CardTitle>
            <CardDescription>Current RAM usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.ram}%</p>
          </CardContent>
        </Card>
      </>
    )
  } else if (userRole === ROLE_NAMES.ADMIN && isAdminStats(stats)) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
            <CardDescription>All employees registered in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.onlineEmployeeCount} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All orders registered in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.orderCompletionRate} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Value</CardTitle>
            <CardDescription>Current value of inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.totalInventoryValue} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High Demand Items</CardTitle>
            <CardDescription>Current top-selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-2xl font-bold cursor-help">
                    <NumberTicker value={stats.highDemandItemCount} />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stats.highDemandItemName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </>
    )
  } else if (userRole === ROLE_NAMES.EMPLOYEE && isEmployeeStats(stats)) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Outbound Inventory</CardTitle>
            <CardDescription>Completed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.outboundInventoryCompletePerMonth} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exported Products</CardTitle>
            <CardDescription>Exported this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.totalProductExportPerMonth} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiring Products</CardTitle>
            <CardDescription>Count this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.productExpirationCount} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imported Products</CardTitle>
            <CardDescription>Imported this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <NumberTicker value={stats.totalProductImportPerMonth} />
            </p>
          </CardContent>
        </Card>
      </>

    )
  }

  return null
}