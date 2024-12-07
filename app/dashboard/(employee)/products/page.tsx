import type { Metadata } from 'next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import ProductsTable from './products-table'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Products Overview</h1>
          <p className="text-[.85rem] text-muted-foreground">
            View product details and track their current status here.
          </p>
        </div>
      </div>
      <ProductsTable />
    </>
  )
}
