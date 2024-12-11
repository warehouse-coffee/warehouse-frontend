import { ImportSummary } from '@/app/api/web-api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface ImportStatisticsProps {
  data: ImportSummary[]
}

export function ImportStatistics({ data }: ImportStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Supplier Name</TableHead>
              <TableHead className="text-center">Total Import Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index} className="border-b border-border/50 hover:bg-accent/5">
                  <TableCell className="text-center">{item.supplierName}</TableCell>
                  <TableCell
                    className="text-center font-semibold text-primary dark:text-primary"
                  >
                    {formatCurrency(parseFloat(item.totalImportCost?.toString() ?? '0'))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-[4rem] text-center text-muted-foreground">
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