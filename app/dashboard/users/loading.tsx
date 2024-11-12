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

export default function UsersLoading() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Users Management</h1>
          <p className="text-[.85rem] text-muted-foreground">
            Manage users and assign their roles effectively here.
          </p>
        </div>
      </div>
      <div className="w-full mt-[1.5rem]">
        <div className="flex items-center justify-between w-full mb-[.85rem]">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[20rem]" />
          </div>
          <Skeleton className="h-10 w-[8rem]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Username
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Email
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Status
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Role
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[10rem]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[15rem]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[6rem]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[8rem]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full flex items-center justify-between mt-[1.25rem]">
          <Skeleton className="h-4 w-[20rem]" /> {/* Showing x to y of z users */}
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