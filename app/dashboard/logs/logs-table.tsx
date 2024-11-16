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
import { useLogList } from '@/hooks/log/useLogList'

import LogsDataLoading from './logs-data-loading'

const LogsData = dynamic(() => import('./logs-data'), {
  ssr: false,
  loading: () => <LogsDataLoading />
})

export default function LogsTable() {
  const { reset } = useQueryErrorResetBoundary()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: logData } = useLogList(
    pagination.pageIndex,
    pagination.pageSize
  )

  // console.log(logData)

  useEffect(() => {
    if (logData?.logVMs) {
      setData(logData.logVMs)
      setTotalElements(logData.page?.totalElements ?? 0)
      setTotalPages(logData.page?.totalPages ?? 0)

      // console.log('Log Data:', {
      //   totalElements: logData.page?.totalElements,
      //   totalPages: logData.page?.totalPages,
      //   currentPage: pagination.pageIndex + 1,
      //   pageSize: pagination.pageSize,
      //   dataLength: logData.logVMs.length
      // })
    }
  }, [logData])

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'date',
        header: 'Date'
      },
      {
        accessorKey: 'logLevel',
        header: 'Level'
      },
      {
        accessorKey: 'message',
        header: 'Message'
      },
      {
        accessorKey: 'hour',
        header: 'Hour'
      },
      {
        accessorKey: 'type',
        header: 'Type'
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search logs..."
              className="min-w-[20rem]"
              value={searchTerm}
              onChange={handleSearch}
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
              <LogsData
                data={data}
                table={table}
              />
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="log"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}