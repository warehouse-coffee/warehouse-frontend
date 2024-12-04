'use client'

import { rankItem } from '@tanstack/match-sorter-utils'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  FilterFn,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  SortingFn,
  flexRender
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
import { Loader } from '@/components/ui/loader'
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
import { useStorageOfUserDetail } from '@/hooks/storage'
import { useDebounce } from '@/hooks/useDebounce'

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

  const [globalSearch, setGlobalSearch] = useState<string>('')
  const debouncedGlobalSearch = useDebounce(globalSearch, 500)
  const [isSearching, setIsSearching] = useState<boolean>(false)

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

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {

    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({ itemRank })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  useEffect(() => {
    if (storageList.length > 0 && !selectedStorageId) {
      setSelectedStorageId(storageList[0].id || 0)
    }
  }, [storageList, selectedStorageId])

  useEffect(() => {
    if (inventoryData?.inventories) {
      setData(inventoryData.inventories)
      setTotalElements(inventoryData.page?.totalElements ?? 0)
      setTotalPages(inventoryData.page?.totalPages ?? 0)
      setIsSearching(false)
    }
  }, [inventoryData])

  const [sorting, setSorting] = useState<SortingState>([])

  // Custom sorting function cho status
  const sortStatusFn: SortingFn<any> = (rowA, rowB, columnId) => {
    const statusA = rowA.getValue(columnId) as string
    const statusB = rowB.getValue(columnId) as string
    const statusOrder = ['In Stock', 'Low Stock', 'Out of Stock']
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
  }

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'productName',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Product Name
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'availableQuantity',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Available Quantity
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'expiration',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Expiration
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        sortingFn: 'datetime'
      },
      {
        accessorKey: 'totalPrice',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Total Price
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'totalSalePrice',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Total Sale Price
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'safeStock',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Safe Stock
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            title={
              column.getCanSort()
                ? column.getNextSortingOrder() === 'asc'
                  ? 'Sort ascending'
                  : column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                : undefined
            }
          >
            Status
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        sortingFn: sortStatusFn
      }
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      columnFilters: debouncedGlobalSearch ? [
        {
          id: 'productName',
          value: debouncedGlobalSearch
        }
      ] : [],
      sorting
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: totalPages,
    sortingFns: {
      sortStatusFn
    }
  })

  useEffect(() => {
    if (debouncedGlobalSearch) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setIsSearching(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [debouncedGlobalSearch])

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
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader color="#fff" size="1.15rem" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
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