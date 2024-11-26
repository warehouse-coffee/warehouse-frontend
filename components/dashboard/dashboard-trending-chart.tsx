'use client'

import React, { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useGetTrendingChart } from '@/hooks/stats/useGetTrendingCharts'

const chartConfig = {
  price: {
    label: 'Price Prediction'
  },
  ai_predict: {
    label: 'AI Prediction',
    color: 'hsl(var(--chart-1))'
  },
  real_price_difference_rate: {
    label: 'Real Price Difference',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function DashboardTrendingChart({ id }: { id: string }) {
  const [timeRange, setTimeRange] = useState<string>('90d')
  const { data: chartData } = useGetTrendingChart()

  const filteredData = chartData?.slice(0, -1).filter((item) => {
    const date = new Date(item.date)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(23, 59, 59, 999)

    let startDate = new Date(yesterday)
    if (timeRange === '30d') {
      startDate.setDate(yesterday.getDate() - 29)
    } else if (timeRange === '7d') {
      startDate.setDate(yesterday.getDate() - 6)
    } else {
      startDate.setDate(yesterday.getDate() - 89)
    }
    startDate.setHours(0, 0, 0, 0)

    return date >= startDate && date <= yesterday
  })

  return (
    <Card id={id}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Coffee Price Prediction</CardTitle>
          <CardDescription>
            AI prediction vs Real price difference rate
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAI" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ai_predict)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ai_predict)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-real_price_difference_rate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-real_price_difference_rate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }}
                  formatter={(value) => `${Number(value).toFixed(2)}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="real_price_difference_rate"
              stroke="var(--color-real_price_difference_rate)"
              fill="url(#fillReal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="ai_predict"
              stroke="var(--color-ai_predict)"
              fill="url(#fillAI)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}