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
  flexRender
} from '@tanstack/react-table'
import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown, CirclePlus } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useGetSaleOrderList } from '@/hooks/order'
import { useDebounce } from '@/hooks/useDebounce'
import { useDialog } from '@/hooks/useDialog'

import AddOrderForm from '../add-order-form'

import SaleDataLoading from './sale-data-loading'

const SaleData = dynamic(() => import('./sale-data'), {
  ssr: false,
  loading: () => <SaleDataLoading />
})

export default function SaleTable() {
  const { reset } = useQueryErrorResetBoundary()
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [sorting, setSorting] = useState<SortingState>([])

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  const { data: orderData, isFetching } = useGetSaleOrderList(
    debouncedSearchValue ? 0 : pagination.pageIndex,
    debouncedSearchValue ? 1000 : pagination.pageSize
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  useEffect(() => {
    if (orderData?.orders) {
      setData(orderData.orders)

      let filteredData = [...orderData.orders]

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(item => {
          const matchesId = item.orderId?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesId
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
        setTotalElements(orderData.page?.totalElements ?? 0)
        setTotalPages(orderData.page?.totalPages ?? 0)
      }
    }
  }, [orderData, debouncedSearchValue, pagination])

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'orderId',
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
            Order ID
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'type',
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
            Type
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'date',
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
            Date
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
        accessorKey: 'orderDetailsCount',
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
            Details Count
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'totalQuantity',
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
            Total Quantity
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'action',
        header: 'Action'
      }
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      columnFilters: debouncedSearchValue ? [
        {
          id: 'orderId',
          value: debouncedSearchValue
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
    pageCount: totalPages
  })

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search order by ID..."
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
        <div>
          <Dialog open={dialogsOpen.add} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white dark:bg-primary/10 dark:text-primary">
                <CirclePlus className="mr-2 h-4 w-4" />
                <span>Add Order</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[40rem]">
              <DialogHeader>
                <DialogTitle>Add Sale Order</DialogTitle>
                <DialogDescription>
                  Fill in the required details to create a new sale order.
                </DialogDescription>
              </DialogHeader>
              <AddOrderForm onClose={() => closeDialog('add')} type='sale' />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center">
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
              <SaleDataLoading />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  {debouncedSearchValue ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        No orders found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                      </span>
                      <span className="text-sm">
                        Try adjusting your search to find what you&apos;re looking for.
                      </span>
                    </div>
                  ) : (
                    'No orders available.'
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
                        <span>There was an error loading the sale orders.</span>
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
                <SaleData
                  data={data}
                  table={table}
                />
              </ErrorBoundary>
            )}
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="order"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}