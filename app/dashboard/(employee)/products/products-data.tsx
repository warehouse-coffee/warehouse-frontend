'use client'

import { format } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { Product } from '@/types'

interface ProductsDataProps {
  data: Product[]
  table: any
}

export default function ProductsData({ data, table }: ProductsDataProps) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
          No products data found.
        </TableCell>
      </TableRow>
    )
  }

  return rows.map((row: any) => (
    <TableRow key={row.id}>
      <TableCell className="text-center">{row.getValue('name')}</TableCell>
      <TableCell className="text-center">{row.getValue('units')}</TableCell>
      <TableCell className="text-center">{row.getValue('quantity')}</TableCell>
      <TableCell className="text-center">
        {row.getValue('status') === 'In Stock' ? (
          <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
            In Stock
          </Badge>
        ) : row.getValue('status') === 'Low Stock' ? (
          <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
            Low Stock
          </Badge>
        ) : (
          <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
            Out of Stock
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.getValue('expiration')), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.getValue('importDate')), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {row.getValue('exportDate') ? format(new Date(row.getValue('exportDate')), 'dd/MM/yyyy') : '-'}
      </TableCell>
    </TableRow>
  ))
}