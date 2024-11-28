'use client'

import { useEffect, useState } from 'react'

import { ReportVM, WarehousePerformance, ImportSummary, ProductPerformance } from '@/app/api/web-api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

import { ImportStatistics } from './import-statistics'
import { ProductComparison } from './product-comparison'
import { WarehouseStatistics } from './warehouse-statistics'

// const sampleData = {
//   warehouseStatistics: Array(10).fill(null).map((_, index) => ({
//     id: index + 1,
//     warehouseName: `Warehouse ${String.fromCharCode(65 + index)}`,
//     revenue: (Math.random() * 20000000 - 10000000).toFixed(4)
//   })),
//   importStatistics: Array(10).fill(null).map((_, index) => ({
//     supplierName: `Supplier ${index + 1}`,
//     totalImportCost: (Math.random() * 10000000 + 5000000).toFixed(2)
//   })),
//   topProducts: Array(10).fill(null).map((_, index) => ({
//     storageId: Math.floor(Math.random() * 5) + 1,
//     productName: `Product ${index + 1}`,
//     totalSold: Math.floor(Math.random() * 1000000),
//     averageStorageTime: (Math.random() * 1000).toFixed(4)
//   })),
//   slowMovingProducts: Array(10).fill(null).map((_, index) => ({
//     storageId: Math.floor(Math.random() * 5) + 1,
//     productName: `Slow Product ${index + 1}`,
//     totalSold: Math.floor(Math.random() * 1000),
//     averageStorageTime: (Math.random() * 10000).toFixed(4)
//   })),
//   totalRevenue: 15000000.75,
//   totalImportCost: 8500000.50,
//   totalOrders: 2500000
// }

export default function ReportStorages() {
  // using UTC date to avoid timezone issues
  const [startDate, setStartDate] = useState<Date>(new Date(Date.UTC(2023, 0, 1)))
  const [endDate, setEndDate] = useState<Date>(new Date(Date.UTC(2025, 0, 31)))
  const { data }: { data: ReportVM } = useReportStorage(
    startDate,
    endDate
  )
  const [warehouseStatistics, setWarehouseStatistics] = useState<WarehousePerformance[]>([])
  const [importStatistics, setImportStatistics] = useState<ImportSummary[]>([])
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([])
  const [slowMovingProducts, setSlowMovingProducts] = useState<ProductPerformance[]>([])
  useEffect(() => {
    if (data) {
      setWarehouseStatistics((data.warehouseStatistics ?? []))
      setImportStatistics((data.importStatistics ?? []))
      setTopProducts((data.topProducts ?? []))
      setSlowMovingProducts((data.slowMovingProducts ?? []))
    }
  }, [data])

  const [month, setMonth] = useState<string>('1')
  const [year, setYear] = useState<string>('2024')
  // update StartDate and EndDate based on selected month and year
  useEffect(() => {
    const newStartDate = new Date(Date.UTC(parseInt(year), parseInt(month), 1))
    // set last day of the month
    const lastDay = month === '2' ? 28 : 30
    const newEndDate = new Date(Date.UTC(parseInt(year), parseInt(month), lastDay))
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }, [month])
  useEffect(() => {
    const newEndDate = new Date(Date.UTC(parseInt(year), parseInt(month), 1))
    setEndDate(newEndDate)
  }, [year])
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
              {renderSummaryItem('Total Revenue', data.totalRevenue ?? 0)}
              {renderSummaryItem('Total Import Cost', data.totalImportCost ?? 0)}
              {renderSummaryItem('Total Orders', data.totalOrders ?? 0, false)}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={setMonth} defaultValue={month}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setYear} defaultValue={year}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 3 }, (_, i) => (
                    <SelectItem key={i} value={(2023 + i).toString()}>
                      {2023 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <ImportStatistics {...importStatistics} />
        </TabsContent>
        <TabsContent value="products">
          <ProductComparison topProducts={topProducts} slowMovingProducts={slowMovingProducts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
