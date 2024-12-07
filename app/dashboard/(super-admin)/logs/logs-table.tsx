'use client'

import { rankItem } from '@tanstack/match-sorter-utils'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  FilterFn
} from '@tanstack/react-table'
import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown, Filter, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import { useLogList } from '@/hooks/log/useLogList'
import { useDebounce } from '@/hooks/useDebounce'

import LogsDataLoading from './logs-data-loading'

const LogsData = dynamic(() => import('./logs-data'), {
  ssr: false,
  loading: () => <LogsDataLoading />
})

interface NoMatchingMessageProps {
  value: string
}

const NoMatchingMessage: React.FC<NoMatchingMessageProps> = ({ value }) => (
  <div className="px-2 py-2 text-sm text-muted-foreground">
    <div className="flex flex-col items-center gap-1">
      <span>
        No items found matching &quot;<span className="font-medium">{value}</span>&quot;
      </span>
      <span className="text-xs">
        Try adjusting your search to find what you&apos;re looking for.
      </span>
    </div>
  </div>
)

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export default function LogsTable() {
  const { reset } = useQueryErrorResetBoundary()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({})
  const [sortConfig, setSortConfig] = useState<{ [key: string]: 'asc' | 'desc' | null }>({
    date: null,
    hour: null,
    type: null
  })
  const [levelFilters, setLevelFilters] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [data, setData] = useState<any[]>([])

  const { data: logData } = useLogList(
    pagination.pageIndex,
    pagination.pageSize
  )

  const handleSort = (columnId: string) => {
    setSortConfig(prev => {
      const newConfig = { ...prev }
      if (newConfig[columnId] === null || newConfig[columnId] === undefined) {
        newConfig[columnId] = 'asc'
      } else if (newConfig[columnId] === 'asc') {
        newConfig[columnId] = 'desc'
      } else {
        newConfig[columnId] = null
      }
      return newConfig
    })

    setSorting(prev => {
      if (prev[0]?.id === columnId) {
        if (prev[0]?.desc) {
          return []
        }
        return [{ id: columnId, desc: true }]
      }
      return [{ id: columnId, desc: false }]
    })
  }

  const handleFilter = (columnId: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev }
      if (newFilters[columnId] === value) {
        delete newFilters[columnId]
      } else {
        newFilters[columnId] = value
      }
      return newFilters
    })
  }

  const handleLevelFilter = (level: string) => {
    setLevelFilters(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level)
      }
      return [...prev, level]
    })
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setIsSearching(true)
  }

  useEffect(() => {
    if (logData?.logVMs) {
      let filteredData = [...logData.logVMs]

      Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
        if (filterValue) {
          filteredData = filteredData.filter(item => {
            const value = String(item[columnId] || '').toLowerCase()
            return value.includes(filterValue.toLowerCase())
          })
        }
      })

      if (levelFilters.length > 0) {
        filteredData = filteredData.filter(item =>
          levelFilters.includes(item.logLevel)
        )
      }

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(log => {
          const matchesMessage = log.message?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          const matchesType = log.type?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesMessage || matchesType
        })
      }

      setData(filteredData)
      setTotalElements(filteredData.length)
      setTotalPages(Math.ceil(filteredData.length / pagination.pageSize))
      setIsSearching(false)
    }
  }, [logData, columnFilters, levelFilters, debouncedSearchValue, pagination.pageSize])

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'date',
        header: 'Date',
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'logLevel',
        header: 'Level',
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'message',
        header: 'Message',
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'hour',
        header: 'Hour',
        filterFn: fuzzyFilter
      },
      {
        accessorKey: 'type',
        header: 'Type',
        filterFn: fuzzyFilter
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
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
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
              placeholder="Search logs..."
              className="min-w-[20rem]"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
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
            <TableRow>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Date
                  {sortConfig.date === 'asc' ? (
                    <ArrowUpAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('date')} />
                  ) : sortConfig.date === 'desc' ? (
                    <ArrowDownAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('date')} />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" onClick={() => handleSort('date')} />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Level
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <DropdownMenuGroup>
                        <div className="px-2 py-2 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="INFO"
                              checked={levelFilters.includes('INFO')}
                              onCheckedChange={() => handleLevelFilter('INFO')}
                            />
                            <label
                              htmlFor="INFO"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              INFO
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="WARNING"
                              checked={levelFilters.includes('WARNING')}
                              onCheckedChange={() => handleLevelFilter('WARNING')}
                            />
                            <label
                              htmlFor="WARNING"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              WARNING
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="ERROR"
                              checked={levelFilters.includes('ERROR')}
                              onCheckedChange={() => handleLevelFilter('ERROR')}
                            />
                            <label
                              htmlFor="ERROR"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              ERROR
                            </label>
                          </div>
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Message
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[16rem]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <div className="px-2 py-2">
                        <div className="relative">
                          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4' />
                          <Input
                            placeholder="Search by message..."
                            className="flex-grow pl-8 pr-2.5"
                            value={columnFilters['message'] || ''}
                            onChange={(e) => handleFilter('message', e.target.value)}
                          />
                        </div>
                      </div>
                      {columnFilters['message'] && !data.some(item =>
                        item.message?.toLowerCase().includes(columnFilters['message'].toLowerCase())
                      ) && (
                        <div className="px-2 pb-2">
                          <NoMatchingMessage value={columnFilters['message']} />
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Hour
                  {sortConfig.hour === 'asc' ? (
                    <ArrowUpAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('hour')} />
                  ) : sortConfig.hour === 'desc' ? (
                    <ArrowDownAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('hour')} />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" onClick={() => handleSort('hour')} />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Type
                  {sortConfig.type === 'asc' ? (
                    <ArrowUpAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('type')} />
                  ) : sortConfig.type === 'desc' ? (
                    <ArrowDownAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('type')} />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" onClick={() => handleSort('type')} />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSearching ? (
              <LogsDataLoading />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                  {debouncedSearchValue ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        No logs found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                      </span>
                      <span className="text-sm">
                        Try adjusting your search to find what you&apos;re looking for.
                      </span>
                    </div>
                  ) : (
                    'No logs available.'
                  )}
                </TableCell>
              </TableRow>
            ) : (
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
            )}
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