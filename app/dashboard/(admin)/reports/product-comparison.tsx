import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface Product {
  storageId: number
  productName: string
  totalSold: number
  averageStorageTime: string
}

interface ProductComparisonProps {
  topProducts: Product[]
  slowMovingProducts: Product[]
}

export function ProductComparison({ topProducts = [], slowMovingProducts = [] }: ProductComparisonProps) {
  const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(Number(value))
  }

  const truncateValue = (value: string, maxLength: number = 8) => {
    return value.length > maxLength ? value.slice(0, 4) + '...' : value
  }

  const renderProductTable = (products: Product[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Storage ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Total Sold</TableHead>
              <TableHead className="text-right">Average Storage Time (Days)</TableHead>
            </TableRow>
          </TableHeader>
          {products.length > 0 ? (
            <TableBody>
              {products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.storageId}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="text-right">
                          {truncateValue(formatNumber(item.totalSold))}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatNumber(item.totalSold)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="text-right">
                          {truncateValue(formatNumber(item.averageStorageTime))}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatNumber(
                          item.averageStorageTime)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center">No data available</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {renderProductTable(topProducts, 'Top Products')}
      {renderProductTable(slowMovingProducts, 'Slow-Moving Products')}
    </div>
  )
}