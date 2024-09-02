import React from 'react'

import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardDescription>Number of registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            <NumberTicker value={1234} />
          </p>
        </CardContent>
      </Card>
    </div>
  )
}