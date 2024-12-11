import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function ProductsDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index} className="border-b border-border/50">
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[12rem]" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[6rem]" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[6rem]" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[5rem] rounded-full" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[8rem]" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[8rem]" /></TableCell>
        <TableCell className="py-[.75rem]"><Skeleton className="h-4 w-[8rem]" /></TableCell>
      </TableRow>
    ))
  )
}