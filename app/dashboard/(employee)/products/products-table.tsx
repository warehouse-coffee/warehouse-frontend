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
import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
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
import { useProductList } from '@/hooks/product'
import { useDebounce } from '@/hooks/useDebounce'

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

  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)

  const [totalElements, setTotalElements] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: productsData, isFetching } = useProductList(
    debouncedSearchValue ? 0 : pagination.pageIndex,
    debouncedSearchValue ? 1000 : pagination.pageSize
  )

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  useEffect(() => {
    if (productsData?.productList) {
      setData(productsData.productList)

      let filteredData = [...productsData.productList]

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(item => {
          const matchesName = item.name?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
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
        setTotalElements(productsData.page?.totalElements ?? 0)
        setTotalPages(productsData.page?.totalPages ?? 0)
      }
    }
  }, [productsData, debouncedSearchValue, pagination])

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
        accessorKey: 'name',
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
        accessorKey: 'units',
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
            Units
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        )
      },
      {
        accessorKey: 'quantity',
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
            Quantity
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
        accessorKey: 'importDate',
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
            Import Date
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        sortingFn: 'datetime'
      },
      {
        accessorKey: 'exportDate',
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
            Export Date
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        sortingFn: 'datetime'
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
          id: 'name',
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
    pageCount: totalPages,
    sortingFns: {
      sortStatusFn
    }
  })

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search products..."
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
              <ProductsDataLoading />
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
                    'No products available.'
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
            )}
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