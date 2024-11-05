'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState
} from '@tanstack/react-table'
import React, { useState, useEffect, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useLogList } from '@/hooks/log/useLogList'

import LogsData from './logs-data'
import LogsDataLoading from './logs-data-loading'

export default function LogsTable() {
  const { reset } = useQueryErrorResetBoundary()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })
  const [totalElements, setTotalElements] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: logData, isFetching } = useLogList(
    pagination.pageIndex,
    pagination.pageSize
  )

  useEffect(() => {
    if (logData?.logVMs) {
      setData(logData.logVMs)
      setTotalElements(logData.page?.totalElements ?? 0)
    }
  }, [logData])

  const table = useReactTable({
    data,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: Math.ceil(totalElements / pagination.pageSize)
  })

  return (
    <div className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search logs..."
              className="min-w-[20rem]"
              value=""
              // onChange={(e) => {}}
            />
            {/* {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader color="#fff" size="1.15rem" />
              </div>
            )} */}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Message</TableHead>
              <TableHead className="text-center">Hour</TableHead>
              <TableHead className="text-center">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span>There was an error loading the logs.</span>
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
              <Suspense fallback={<LogsDataLoading />}>
                <LogsData
                  data={data}
                  isLoading={isFetching}
                  table={table}
                />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center justify-between mt-[1.25rem]">
        <p className="text-[.85rem] text-muted-foreground">
          Showing {' '}
          {totalElements === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} {' '}
          to {' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            totalElements
          )}{' '}
          of {totalElements} log{totalElements > 1 ? 's' : ''}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => table.previousPage()}
                aria-disabled={!table.getCanPreviousPage()}
                className={!table.getCanPreviousPage() ? 'cursor-not-allowed pointer-events-none opacity-75' : ''}
              />
            </PaginationItem>
            {table.getPageOptions().map((pageIdx) => (
              <PaginationItem key={pageIdx}>
                <PaginationLink
                  href="#"
                  isActive={pageIdx === table.getState().pagination.pageIndex}
                  onClick={() => table.setPageIndex(pageIdx)}
                >
                  {pageIdx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => table.nextPage()}
                aria-disabled={!table.getCanNextPage()}
                className={!table.getCanNextPage() ? 'cursor-not-allowed pointer-events-none opacity-75' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}