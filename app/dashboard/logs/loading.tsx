import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function LogsLoading() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Logs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Logs Management</h1>
          <p className="text-[.85rem] text-muted-foreground">
            View and manage system logs here.
          </p>
        </div>
      </div>
      <div className="w-full mt-[1.5rem]">
        <div className="flex items-center justify-between w-full mb-[.85rem]">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[20rem]" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">Message</TableHead>
                <TableHead className="text-center">Hour</TableHead>
                <TableHead className="text-center">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full flex items-center justify-between mt-[1.25rem]">
          <Skeleton className="h-4 w-[20rem]" /> {/* Showing x to y of z logs */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" /> {/* Previous */}
            <Skeleton className="h-8 w-8" /> {/* Page 1 */}
            <Skeleton className="h-8 w-8" /> {/* Page 2 */}
            <Skeleton className="h-8 w-8" /> {/* Page 3 */}
            <Skeleton className="h-8 w-8" /> {/* Next */}
          </div>
        </div>
      </div>
    </>
  )
}