import React from 'react'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Log, LogLevel } from '@/types'

interface LogsDataProps {
  data: Log[]
  table: any
}

const LOG_LEVEL_STYLES: Record<LogLevel, { className: string }> = {
  INFO: {
    className: 'dark:bg-primary/10 dark:text-primary'
  },
  WARNING: {
    className: 'dark:bg-yellow-500/30 dark:text-yellow-500'
  },
  ERROR: {
    className: 'dark:bg-destructive/30 dark:text-red-500'
  }
} as const

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const style = LOG_LEVEL_STYLES[level] || LOG_LEVEL_STYLES.INFO

  return (
    <Badge variant="outline" className={style.className}>
      {level}
    </Badge>
  )
}

export default function LogsData({ data, table }: LogsDataProps) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={5}
          className="h-24 text-center text-muted-foreground"
        >
          No logs available.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {rows.map((row: any) => {
        const log = row.original
        return (
          <TableRow key={log.id || row.id}>
            <TableCell className="text-center">
              {formatDate(log.date)}
            </TableCell>
            <TableCell className="text-center">
              <LogLevelBadge level={log.logLevel} />
            </TableCell>
            <TableCell className="text-center">
              {log.message}
            </TableCell>
            <TableCell className="text-center">
              {log.hour}
            </TableCell>
            <TableCell className="text-center">
              {log.type}
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}