import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function CompaniesDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index} className="border-b border-border/50">
        <TableCell className="py-[.75rem] text-center">
          <Skeleton className="h-4 w-[8rem] mx-auto" />
        </TableCell>
        <TableCell className="py-[.75rem] text-center">
          <Skeleton className="h-4 w-[15rem] mx-auto" />
        </TableCell>
        <TableCell className="py-[.75rem] text-center">
          <Skeleton className="h-4 w-[10rem] mx-auto" />
        </TableCell>
        <TableCell className="py-[.75rem] text-center">
          <div className="flex justify-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))
  )
}