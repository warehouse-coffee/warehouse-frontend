import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function UsersDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index} className="border-b border-border/50">
        <TableCell className="py-[.75rem]">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </TableCell>
        <TableCell className="py-[.75rem]">
          <Skeleton className="h-4 w-[300px]" />
        </TableCell>
        <TableCell className="py-[.75rem]">
          <Skeleton className="h-4 w-16 rounded-full" />
        </TableCell>
        <TableCell className="py-[.75rem]">
          <Skeleton className="h-4 w-20 rounded-full" />
        </TableCell>
        <TableCell className="text-right py-[.75rem]">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ))
  )
}