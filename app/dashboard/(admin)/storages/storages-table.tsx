'use client'

import { rankItem } from '@tanstack/match-sorter-utils'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  FilterFn,
  flexRender
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, CirclePlus } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { StorageDto2 } from '@/app/api/web-api-client'
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
import { useUserStorageList } from '@/hooks/storage'
import { useDebounce } from '@/hooks/useDebounce'
import { useDialog } from '@/hooks/useDialog'

import StoragesCreate from './storages-create'
import StoragesDataLoading from './storages-data-loading'

const StoragesData = dynamic(() => import('./storages-data'), {
  ssr: false,
  loading: () => <StoragesDataLoading />
})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export default function StorageTable() {
  const { reset } = useQueryErrorResetBoundary()
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [data, setData] = useState<StorageDto2[]>([])

  const { data: storageData, isFetching } = useUserStorageList(
    debouncedSearchValue ? 0 : pagination.pageIndex,
    debouncedSearchValue ? 1000 : pagination.pageSize
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  useEffect(() => {
    if (storageData?.storages) {
      let filteredData = [...storageData.storages]

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(storage => {
          const matchesName = storage.name?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          const matchesAddress = storage.address?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesName || matchesAddress
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
        setTotalElements(storageData.page?.totalElements || filteredData.length)
        setTotalPages(storageData.page?.totalPages || Math.ceil(filteredData.length / pagination.pageSize))
      }
    }
  }, [storageData, debouncedSearchValue, pagination])

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
            Name
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'address',
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
            Address
            {{
              asc: <ArrowUpAZ className="h-4 w-4" />,
              desc: <ArrowDownAZ className="h-4 w-4" />
            }[column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />}
          </div>
        ),
        filterFn: fuzzyFilter
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
        filterFn: fuzzyFilter
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>
      }
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter: debouncedSearchValue
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    manualPagination: true,
    pageCount: totalPages
  })

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search storages..."
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
                <span>Add Storage</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[50rem]">
              <DialogHeader>
                <DialogTitle>Add Storage</DialogTitle>
                <DialogDescription>
                  Fill in the required details to create a new storage location.
                </DialogDescription>
              </DialogHeader>
              <StoragesCreate onClose={() => closeDialog('add')} />
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
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span>There was an error loading the storage data.</span>
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
              {isFetching ? (
                <StoragesDataLoading />
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                    {debouncedSearchValue ? (
                      <div className="flex flex-col items-center gap-1">
                        <span>
                          No storages found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                        </span>
                        <span className="text-sm">
                          Try adjusting your search to find what you&apos;re looking for.
                        </span>
                      </div>
                    ) : (
                      'No storages available.'
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                <StoragesData
                  data={data}
                  table={table}
                />
              )}
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="storage"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}