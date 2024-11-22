'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { ROLE_NAMES } from '@/constants'
import { useGetStats, isAdminStats, isSuperAdminStats } from '@/hooks/stats/useGetStats'
import { Prediction } from '@/hooks/stats/useGetStats'

type DashboardPieChartProps = {
  id: string
  userRole: string | null
}

const chartConfig = {
  prediction: {
    label: 'Prediction',
    color: 'hsl(var(--chart-1))'
  },
  real_time: {
    label: 'Real-time',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function DashboardPieChart({ id, userRole }: DashboardPieChartProps) {
  const { data: stats } = useGetStats(userRole)

  const chartData = React.useMemo(() => {
    if (!stats) return []

    let predictionData: Prediction | undefined

    if (userRole === ROLE_NAMES.SUPER_ADMIN && isSuperAdminStats(stats)) {
      predictionData = stats.prediction
    } else if (userRole === ROLE_NAMES.ADMIN && isAdminStats(stats)) {
      predictionData = stats.prediction
    }

    if (!predictionData) return []

    const data = [
      {
        type: 'prediction',
        value: predictionData.accuracy,
        fill: 'hsl(var(--chart-1))'
      },
      {
        type: 'real_time',
        value: 100 - predictionData.accuracy,
        fill: 'hsl(var(--chart-2))'
      }
    ]

    return data
  }, [stats, userRole])

  const getTrendIcon = (prediction: number) => {
    if (prediction > 0) {
      return <TrendingUp className="h-4 w-4" />
    } else if (prediction < 0) {
      return <TrendingDown className="h-4 w-4" />
    }
    return <Minus className="h-4 w-4" />
  }

  let predictionData: Prediction | undefined

  if (userRole === ROLE_NAMES.SUPER_ADMIN && isSuperAdminStats(stats)) {
    predictionData = stats.prediction
  } else if (userRole === ROLE_NAMES.ADMIN && isAdminStats(stats)) {
    predictionData = stats.prediction
  }

  if (!predictionData) {
    return (
      <Card className="flex flex-col" id={id}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Prediction Analysis</CardTitle>
          <CardDescription>No prediction data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const predictionDate = new Date(predictionData.date)
  const formattedDate = predictionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className="flex flex-col" id={id}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Prediction Analysis</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
              className="dark:stroke-[#000]"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {predictionData.accuracy}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Prediction
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Prediction Confidence: {(predictionData.aI_predict).toFixed(2)}
          {getTrendIcon(predictionData.aI_predict)}
        </div>
        <div className="leading-none text-muted-foreground">
          Coffee price forecast
        </div>
      </CardFooter>
    </Card>
  )
}