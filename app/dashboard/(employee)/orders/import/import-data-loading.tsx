import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function ImportDataLoading() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {[...Array(7)].map((_, cellIndex) => (
            <TableCell key={cellIndex} className="text-center">
              <Skeleton className="h-6 w-24 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}