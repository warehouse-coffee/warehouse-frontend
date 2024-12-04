'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useInventoriesByStorage } from '@/hooks/inventory/useGetInventoryListByStorage'
import { useStorageOfUserDetail } from '@/hooks/storage/useStorageOfUserDetail'

import InventoryDataLoading from './inventory-data-loading'

const InventoryDataMain = dynamic(() => import('./inventory-data'), {
  ssr: false,
  loading: () => <InventoryDataLoading />
})

export default function InventoryTable() {
  const { reset } = useQueryErrorResetBoundary()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [totalElements, setTotalElements] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedStorageId, setSelectedStorageId] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: storageData } = useStorageOfUserDetail()
  const storageList = useMemo(() => storageData?.storages || [], [storageData?.storages])

  const { data: inventoryData } = useInventoriesByStorage(
    selectedStorageId,
    pagination.pageIndex,
    pagination.pageSize
  )

  useEffect(() => {
    if (storageList.length > 0 && !selectedStorageId) {
      setSelectedStorageId(storageList[0].id || 0)
    }
  }, [storageList, selectedStorageId])

  useEffect(() => {
    if (inventoryData) {
      setData(inventoryData)
      setTotalElements(inventoryData.page?.totalElements ?? 0)
      setTotalPages(inventoryData.page?.totalPages ?? 0)
    }
  }, [inventoryData])

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'productName',
        header: 'Product Name'
      },
      {
        accessorKey: 'availableQuantity',
        header: 'Available Quantity'
      },
      {
        accessorKey: 'expiration',
        header: 'Expiration'
      },
      {
        accessorKey: 'totalPrice',
        header: 'Total Price'
      },
      {
        accessorKey: 'totalSalePrice',
        header: 'Total Sale Price'
      },
      {
        accessorKey: 'safeStock',
        header: 'Safe Stock'
      },
      {
        accessorKey: 'status',
        header: 'Status'
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
        <Select value={selectedStorageId.toString()} onValueChange={(value) => setSelectedStorageId(Number(value))}>
          <SelectTrigger className="w-[16rem]">
            <SelectValue placeholder="Select your inventory" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select your inventory</SelectLabel>
              {!storageList.length ? (
                <SelectItem disabled aria-disabled value="None">
                  No inventory available.
                </SelectItem>
              ) : (
                storageList.map((storage) => (
                  <SelectItem key={storage.id} value={storage.id?.toString() || ''}>
                    {storage.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search products in inventory..."
              className="min-w-[20rem]"
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  Product Name
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Available Quantity
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Expiration
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Total Price
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Total Sale Price
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Safe Stock
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Status
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span>There was an error loading the inventory data.</span>
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
              <InventoryDataMain
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