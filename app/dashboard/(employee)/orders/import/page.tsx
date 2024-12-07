import type { Metadata } from 'next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import ImportTable from './import-table'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function ImportOrdersPage() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Import Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Import Orders Management</h1>
          <p className="text-[.85rem] text-muted-foreground">
            Manage import orders and assign their status effectively here.
          </p>
        </div>
      </div>
      <ImportTable />
    </>
  )
}