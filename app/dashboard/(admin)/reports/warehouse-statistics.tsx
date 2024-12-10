import { WarehousePerformance } from '@/app/api/web-api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface WarehouseStatisticsProps {
  data: WarehousePerformance[]
}

export function WarehouseStatistics({ data }: WarehouseStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5rem]">ID</TableHead>
              <TableHead className="text-center w-[45%]">Warehouse Name</TableHead>
              <TableHead className="text-center">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id} className="border-b border-border/50 hover:bg-accent/5">
                  <TableCell className="font-medium text-center">{item.id}</TableCell>
                  <TableCell className="text-center">{item.warehouseName}</TableCell>
                  <TableCell
                    className={`text-center font-semibold ${
                      item.revenue! >= 0 ? 'text-primary dark:text-primary' : 'text-destructive dark:text-red-500'
                    }`}
                  >
                    {formatCurrency(parseFloat(item.revenue?.toString() ?? '0'))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-[4rem] text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}