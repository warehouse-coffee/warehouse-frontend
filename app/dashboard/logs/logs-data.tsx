import React from 'react'

import {
  TableCell,
  TableRow
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Log } from '@/types'

interface LogsDataProps {
  data: Log[]
  isLoading: boolean
  table: any
}

export default function LogsData({ data, isLoading, table }: LogsDataProps) {
  if (table.getRowModel().rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
          No logs available.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {table.getRowModel().rows.map((row: any) => (
        <TableRow key={row.original.id}>
          <TableCell className="text-center">{formatDate(row.original.date)}</TableCell>
          <TableCell className="text-center">{row.original.logLevel}</TableCell>
          <TableCell className="text-center">{row.original.message}</TableCell>
          <TableCell className="text-center">{row.original.hour}</TableCell>
          <TableCell className="text-center">{row.original.type}</TableCell>
        </TableRow>
      ))}
    </>
  )
}