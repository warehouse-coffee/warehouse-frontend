import type { Metadata } from 'next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import UsersTable from './users-table'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function UsersPage() {
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
      <UsersTable />
    </>
  )
}