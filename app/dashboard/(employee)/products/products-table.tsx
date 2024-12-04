'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState
} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useProductList } from '@/hooks/product'

import ProductsDataLoading from './products-data-loading'

const ProductsDataMain = dynamic(() => import('./products-data'), {
  ssr: false,
  loading: () => <ProductsDataLoading />
})

export default function ProductsTable() {
  const { reset } = useQueryErrorResetBoundary()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [totalElements, setTotalElements] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [data, setData] = useState<any[]>([])
  // const [searchQuery, setSearchQuery] = useState<string>('')

  const { data: productsData } = useProductList(
    pagination.pageIndex,
    pagination.pageSize
  )

  useEffect(() => {
    if (productsData?.productList) {
      setData(productsData.productList || [])
      setTotalElements(productsData.page?.totalElements || 0)
      setTotalPages(productsData.page?.totalPages || 0)
    }
  }, [productsData])

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'name',
        header: 'Product Name'
      },
      {
        accessorKey: 'units',
        header: 'Units'
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity'
      },
      {
        accessorKey: 'status',
        header: 'Status'
      },
      {
        accessorKey: 'expiration',
        header: 'Expiration'
      },
      {
        accessorKey: 'importDate',
        header: 'Import Date'
      },
      {
        accessorKey: 'exportDate',
        header: 'Export Date'
      }
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: totalPages
  })

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search products..."
              className="min-w-[20rem]"
              value=""
              onChange={() => {}}
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-center">Units</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Expiration</TableHead>
              <TableHead className="text-center">Import Date</TableHead>
              <TableHead className="text-center">Export Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span>There was an error loading the products data.</span>
                      <Button
                        onClick={() => resetErrorBoundary()}
                        variant="outline"
                        className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
                      >
                          Try again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            >
              <ProductsDataMain
                data={data}
                table={table}
              />
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="product"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}
