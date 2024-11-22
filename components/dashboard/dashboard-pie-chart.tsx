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
import { useGetStats, isAdminStats } from '@/hooks/stats/useGetStats'

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
    if (!stats || !isAdminStats(stats)) {
      return []
    }

    const data = [
      {
        type: 'prediction',
        value: stats.prediction.accuracy,
        fill: 'hsl(var(--chart-1))'
      },
      {
        type: 'real_time',
        value: 100 - stats.prediction.accuracy,
        fill: 'hsl(var(--chart-2))'
      }
    ]

    return data
  }, [stats])

  const getTrendIcon = (prediction: number) => {
    if (prediction > 0) {
      return <TrendingUp className="h-4 w-4" />
    } else if (prediction < 0) {
      return <TrendingDown className="h-4 w-4" />
    }
    return <Minus className="h-4 w-4" />
  }

  if (!isAdminStats(stats)) {
    return (
      <Card className="flex flex-col" id={id}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Prediction Analysis</CardTitle>
          <CardDescription>Invalid data type</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const predictionDate = new Date(stats.prediction.date)
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
                          {stats.prediction.accuracy}%
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
          Prediction Confidence: {(stats.prediction.aI_predict).toFixed(2)}
          {getTrendIcon(stats.prediction.aI_predict)}
        </div>
        <div className="leading-none text-muted-foreground">
          Coffee price forecast
        </div>
      </CardFooter>
    </Card>
  )
}