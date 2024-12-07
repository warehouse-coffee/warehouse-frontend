import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function CompaniesDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell className="py-3">
          <Skeleton className="h-4 w-[8rem]" />
        </TableCell>
        <TableCell className="py-3">
          <Skeleton className="h-4 w-[15rem]" />
        </TableCell>
        <TableCell className="py-3">
          <Skeleton className="h-4 w-[10rem]" />
        </TableCell>
        <TableCell className="text-right py-3">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))
  )
}