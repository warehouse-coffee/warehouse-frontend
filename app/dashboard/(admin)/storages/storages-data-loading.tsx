import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function StoragesDataLoading() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-b border-border/50">
          <TableCell className="text-center py-[.75rem]">
            <Skeleton className="h-4 w-[3rem] mx-auto" />
          </TableCell>
          <TableCell className="text-center py-[.75rem]">
            <Skeleton className="h-4 w-[8rem] mx-auto" />
          </TableCell>
          <TableCell className="text-center py-[.75rem]">
            <Skeleton className="h-4 w-[12rem] mx-auto" />
          </TableCell>
          <TableCell className="text-center py-[.75rem]">
            <Skeleton className="h-4 w-[4rem] mx-auto" />
          </TableCell>
          <TableCell className="py-[.75rem]">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
