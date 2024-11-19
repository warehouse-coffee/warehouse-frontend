import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function LogsLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-32 mx-auto" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-16 mx-auto" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-16 mx-auto" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableCell>
      </TableRow>
    ))
  )
}