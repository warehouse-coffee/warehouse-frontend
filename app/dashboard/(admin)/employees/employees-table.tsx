'use client'
import { rankItem } from '@tanstack/match-sorter-utils'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
  FilterFn,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Filter,
  Pencil,
  Trash
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { EmployeeDto, Page } from '@/app/api/web-api-client'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useEmployeeList } from '@/hooks/employee/useEmployeeList'
// import { useDialog } from '@/hooks/useDialog'
import { Employee } from '@/types'

import EmployeesDataLoading from './employees-data-loading'

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'userName' | 'email' | 'phoneNumber' | 'isActived' | null;
const EmployeeDataMain = dynamic(() => import('./employees-data'), {
  ssr: false,
  loading: () => <EmployeesDataLoading />
})
const EmployeeActions = React.memo(
  ({
    employee,
    onEdit,
    onDelete
  }: {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
  }) => (
    <TableCell className="text-right">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEdit(employee)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onDelete(employee)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </TableCell>
  )
)
EmployeeActions.displayName = 'EmployeeActions'
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}
export default function EmployeesTable() {
  const { reset } = useQueryErrorResetBoundary()
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  //page
  const [page, setPage] = useState<Page>(new Page())
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize:  8
  })
  // Employee list
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const { data: employeeListVM, refetch } = useEmployeeList(
    pagination.pageIndex,
    pagination.pageSize
  )

  useEffect(() => {
    if (employeeListVM) {
      setEmployees(employeeListVM.employees || [])
      if (employeeListVM.page) {
        setPage(employeeListVM.page)
      }
    }
  }, [employeeListVM])
  const sortEmployees = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const columns = useMemo<ColumnDef<EmployeeDto>[]> (() => [
    {
      accessorKey: 'userName',
      header: 'User Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number'
    },
    {
      accessorKey: 'isActived',
      header: 'Active Status'
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          Action
        </Button>
      )
    }
  ], [])
  const table = useReactTable({
    data: employees || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    manualPagination: true,
    pageCount: page.totalPages
  })
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees('userName')}
                  className="cursor-pointer"
                >
                  User Name

                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[10rem]">
                    <DropdownMenuLabel>
                        Sort by
                    </DropdownMenuLabel>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter User Name"
                      value={filters.userName || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, userName: e.target.value })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees('email')}
                  className="cursor-pointer"
                >
                  Email
                  {sortField === 'email' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Email"
                      value={filters.email || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, email: e.target.value })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees('phoneNumber')}
                  className="cursor-pointer"
                >
                  Phone Number
                  {sortField === 'phoneNumber' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Phone Number"
                      value={filters.phoneNumber || ''}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          phoneNumber: e.target.value
                        })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees('isActived')}
                  className="cursor-pointer"
                >
                  Active Status
                  {sortField === 'isActived' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setFilters({ ...filters, isActived: '' })}
                    >
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters({ ...filters, isActived: 'true' })
                      }
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters({ ...filters, isActived: 'false' })
                      }
                    >
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <TableRow>
                <TableCell className="w-full flex flex-col items-center justify-center">
                  There was an error! Please try again.
                  <Button onClick={() => resetErrorBoundary()}>
                    Try again
                  </Button>
                </TableCell>
              </TableRow>
            )}
          >
            <Suspense fallback={<EmployeesDataLoading />}>
              <EmployeeDataMain table={table} onRefresh={refetch} />
            </Suspense>
          </ErrorBoundary>
        </TableBody>
      </Table>
      <DashboardTablePagination
        itemName="storage"
        table={table}
        totalElements={page.totalElements ?? 0}
        totalPages={page.totalPages ?? 0}
      />
    </>
  )
}