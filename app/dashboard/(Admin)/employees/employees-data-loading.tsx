import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function EmployeesDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-[10rem]" />
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-[15rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[6rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[8rem]" /></TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))
  )
}