import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function ProductsDataLoading() {
  return (
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-[12rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[6rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[6rem]" /></TableCell>
        <TableCell><Skeleton className="h-6 w-[5rem] rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[8rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[8rem]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[8rem]" /></TableCell>
      </TableRow>
    ))
  )
} 