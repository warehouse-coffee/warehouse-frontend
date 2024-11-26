import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface SlowMovingProduct {
  storageId: number
  productName: string
  totalSold: number
  averageStorageTime: string
}

interface SlowMovingProductsProps {
  data: SlowMovingProduct[]
}

export default function SlowMovingProducts({ data }: SlowMovingProductsProps) {
  const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(Number(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slow-Moving Products</CardTitle>
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
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.storageId}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell className="text-right">{item.totalSold}</TableCell>
                <TableCell className="text-right">{formatNumber(item.averageStorageTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
