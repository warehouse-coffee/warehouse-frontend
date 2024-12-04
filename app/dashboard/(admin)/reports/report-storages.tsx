'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { DateRange } from 'react-day-picker'

import { ReportVM, WarehousePerformance, ImportSummary, ProductPerformance } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useReportStorage } from '@/hooks/report'
import { cn } from '@/lib/utils'

import { ImportStatistics } from './import-statistics'
import { ProductComparison } from './product-comparison'
import { WarehouseStatistics } from './warehouse-statistics'

export default function ReportStorages() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })

  const { data }: { data: ReportVM } = useReportStorage(startDate, endDate)
  const [warehouseStatistics, setWarehouseStatistics] = useState<WarehousePerformance[]>([])
  const [importStatistics, setImportStatistics] = useState<ImportSummary[]>([])
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([])
  const [slowMovingProducts, setSlowMovingProducts] = useState<ProductPerformance[]>([])

  useEffect(() => {
    if (data) {
      setWarehouseStatistics(data.warehouseStatistics ?? [])
      setImportStatistics(data.importStatistics ?? [])
      setTopProducts(data.topProducts ?? [])
      setSlowMovingProducts(data.slowMovingProducts ?? [])
    }
  }, [data])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const truncateValue = (value: string, maxLength: number = 8) => {
    return value.length > maxLength ? value.slice(0, 4) + '...' : value
  }

  const renderSummaryItem = (label: string, value: number, isCurrency: boolean = true) => {
    const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value)
    const displayValue = truncateValue(formattedValue)

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{displayValue}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formattedValue}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Storages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="grid grid-cols-3 gap-4">
              {renderSummaryItem('Total Revenue', data?.totalRevenue ?? 0)}
              {renderSummaryItem('Total Import Cost', data?.totalImportCost ?? 0)}
              {renderSummaryItem('Total Orders Completed', data?.totalOrders ?? 0, false)}
            </div>
            <div className="flex gap-4">
              <div>
                <p className="mb-2 text-sm font-medium">Start Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[200px] justify-start text-left font-normal'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      disabled={(date) => date > endDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">End Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[200px] justify-start text-left font-normal'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      disabled={(date) => date < startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="warehouse" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="warehouse">Warehouse Statistics</TabsTrigger>
          <TabsTrigger value="import">Import Statistics</TabsTrigger>
          <TabsTrigger value="products">Product Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="warehouse">
          <WarehouseStatistics {...warehouseStatistics} />
        </TabsContent>
        <TabsContent value="import">
          <ImportStatistics data={importStatistics} />
        </TabsContent>
        <TabsContent value="products">
          <ProductComparison topProducts={topProducts} slowMovingProducts={slowMovingProducts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
