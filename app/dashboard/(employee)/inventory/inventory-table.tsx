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
import { useInventoriesByStorage } from '@/hooks/inventory'
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

  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)

  const [totalElements, setTotalElements] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedStorageId, setSelectedStorageId] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: storageData } = useStorageOfUserDetail()
  const storageList = useMemo(() => storageData?.storages || [], [storageData?.storages])

  const { data: inventoryData, isFetching } = useInventoriesByStorage(
    selectedStorageId,
    debouncedSearchValue ? 0 : pagination.pageIndex,
    debouncedSearchValue ? 1000 : pagination.pageSize
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

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  useEffect(() => {
    if (inventoryData?.inventories) {
      setData(inventoryData.inventories)

      let filteredData = [...inventoryData.inventories]

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(item => {
          const matchesName = item.productName?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesName
        })
      }

      if (debouncedSearchValue) {
        if (filteredData.length === 0) {
          setData([])
          setTotalElements(0)
          setTotalPages(0)
        } else {
          const startIndex = pagination.pageIndex * pagination.pageSize
          const endIndex = startIndex + pagination.pageSize
          setData(filteredData.slice(startIndex, endIndex))
          setTotalElements(filteredData.length)
          setTotalPages(Math.ceil(filteredData.length / pagination.pageSize))
        }
      } else {
        setData(filteredData)
        setTotalElements(inventoryData.page?.totalElements ?? 0)
        setTotalPages(inventoryData.page?.totalPages ?? 0)
      }
    }
  }, [inventoryData, debouncedSearchValue, pagination])

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
        accessorKey: 'id',
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
            ID
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        filterFn: fuzzyFilter
      },
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
      sorting,
      globalFilter: debouncedSearchValue
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
              placeholder="Search inventory..."
              className="min-w-[20rem]"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isFetching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader className="dark:stroke-white" size="1.15rem" />
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
            {isFetching ? (
              <InventoryDataLoading />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  {debouncedSearchValue ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        No items found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                      </span>
                      <span className="text-sm">
                        Try adjusting your search to find what you&apos;re looking for.
                      </span>
                    </div>
                  ) : (
                    'No inventory items available.'
                  )}
                </TableCell>
              </TableRow>
            ) : (
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
            )}
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="item"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}