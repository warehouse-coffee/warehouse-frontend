// 'use client'

// import { driver } from 'driver.js'
import React from 'react'

import { DashboardPieChart } from '@/components/dashboard/dashboard-pie-chart'
import { DashboardTrendingChart } from '@/components/dashboard/dashboard-trending-chart'
import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import 'driver.js/dist/driver.css'

export default function DashboardPage() {
  // useEffect(() => {
  //   const tourObj = driver({
  //     showProgress: true,
  //     steps: [
  //       { element: '#tour-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: 'left', align: 'start' } },
  //       { element: '#tour-example2', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: 'bottom', align: 'start' } },
  //       { element: '#tour-example3', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: 'bottom', align: 'start' } },
  //       { element: '#tour-example4', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: 'left', align: 'start' } },
  //       { element: '#tour-example5', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: 'top', align: 'start' } },
  //       { element: '#tour-example6', popover: { title: 'More Configuration', description: 'Look at this page for all the configuration options you can pass.', side: 'right', align: 'start' } }
  //     ]
  //   })

  //   tourObj.drive()
  // }, [])
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card id="tour-example">
        <CardHeader>
          <CardTitle>Total Staffs</CardTitle>
          <CardDescription>Number of registered staffs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            <NumberTicker value={1234} />
          </p>
        </CardContent>
      </Card>
      <Card id="tour-example2">
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
          <CardDescription>Number of registered products</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            <NumberTicker value={1234} />
          </p>
        </CardContent>
      </Card>
      <Card id="tour-example3">
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
      <Card id="tour-example4">
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
      <div className="md:col-span-2 lg:col-span-3">
        <DashboardTrendingChart id="tour-example5" />
      </div>
      <DashboardPieChart id="tour-example6" />
    </div>
  )
}