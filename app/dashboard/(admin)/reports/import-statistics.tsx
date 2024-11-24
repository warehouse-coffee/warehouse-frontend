import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface ImportStatistic {
  supplierName: string
  totalImportCost: string
}

interface ImportStatisticsProps {
  data: ImportStatistic[]
}

export function ImportStatistics({ data = [] }: ImportStatisticsProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(value))
  }

  const truncateValue = (value: string, maxLength: number = 8) => {
    return value.length > maxLength ? value.slice(0, 4) + '...' : value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier Name</TableHead>
              <TableHead className="text-right">Total Import Cost</TableHead>
            </TableRow>
          </TableHeader>
          {data.length > 0 ? (
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.supplierName}</TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="text-right">
                          {truncateValue(formatCurrency(item.totalImportCost))}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatCurrency(item.totalImportCost)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="text-center">No data available</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}