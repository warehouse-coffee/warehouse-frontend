import { ProductPerformance } from '@/app/api/web-api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface ProductComparisonProps {
  topProducts: ProductPerformance[]
  slowMovingProducts: ProductPerformance[]
}

export function ProductComparison({ topProducts, slowMovingProducts }: ProductComparisonProps) {
  const renderProductTable = (products: ProductPerformance[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center w-[15rem]">Product Name</TableHead>
              <TableHead className="text-center">Total Sold</TableHead>
              <TableHead className="text-center">Avg Time (Days)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((item, index) => (
                <TableRow key={index} className="border-b border-border/50 hover:bg-accent/5">
                  <TableCell className="font-medium text-center">{item.storageId}</TableCell>
                  <TableCell className="text-center w-[15rem]">{item.productName}</TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(item.totalSold ?? 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {Math.floor(item.averageStorageTime ?? 0)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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