import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function ImportDataLoading() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index} className="border-b border-border/50">
          {[...Array(7)].map((_, cellIndex) => (
            <TableCell key={cellIndex} className="py-[.75rem] text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}