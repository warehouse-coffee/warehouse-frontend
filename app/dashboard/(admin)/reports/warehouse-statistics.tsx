import { WarehousePerformance } from '@/app/api/web-api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
interface ImportSummaryProps {
  data: WarehousePerformance[]
}
export function WarehouseStatistics({ data }: ImportSummaryProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(value))
  }

  const truncateValue = (value: string, maxLength: number = 12) => {
    return value.length > maxLength ? value.slice(0, 8) + '...' : value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[45%]">Warehouse Name</TableHead>
              <TableHead className="text-right w-[300px] pr-8">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          {data.length > 0 ? (
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.warehouseName}</TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell
                          className={`text-right font-semibold pr-8 ${
                            parseFloat(item.revenue?.toString() ?? '0') >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {truncateValue(formatCurrency(item.revenue?.toString() ?? '0'))}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{formatCurrency(item.revenue?.toString() ?? '0')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
