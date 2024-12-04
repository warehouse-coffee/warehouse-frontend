'use client'

import { format } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { Inventory } from '@/types'

interface InventoryDataProps {
  data: Inventory[]
  table: any
}

export default function InventoryData({ data, table }: InventoryDataProps) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
          No inventory data found.
        </TableCell>
      </TableRow>
    )
  }

  return rows.map((row: any) => (
    <TableRow key={row.id}>
      <TableCell className="text-center">{row.getValue('productName')}</TableCell>
      <TableCell className="text-center">{row.getValue('availableQuantity')}</TableCell>
      <TableCell className="text-center">
        {format(new Date(row.getValue('expiration')), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="text-center">{formatCurrency(row.getValue('totalPrice'))}</TableCell>
      <TableCell className="text-center">{formatCurrency(row.getValue('totalSalePrice'))}</TableCell>
      <TableCell className="text-center">{row.getValue('safeStock')}</TableCell>
      <TableCell className="text-center">
        {row.getValue('status') === 'In Stock' ? (
          <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
            {row.getValue('status')}
          </Badge>
        ) : row.getValue('status') === 'Low Stock' ? (
          <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
            {row.getValue('status')}
          </Badge>
        ) : (
          <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
            {row.getValue('status')}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  ))
}
