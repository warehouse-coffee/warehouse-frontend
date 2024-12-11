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
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table'
import { ArrowUpDown, CirclePlus, ArrowUpAZ, ArrowDownAZ, Filter, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useDebounce } from '@/hooks/useDebounce'
import { useDialog } from '@/hooks/useDialog'
import { useUserList } from '@/hooks/user'
import { User } from '@/types'

import AddUserForm from './add-user-form'
import UsersDataLoading from './users-data-loading'

const UserDataMain = dynamic(() => import('./users-data'), {
  ssr: false,
  loading: () => <UsersDataLoading />
})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

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

export default function UsersTable() {
  const { reset } = useQueryErrorResetBoundary()

  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({})
  const [sortConfig, setSortConfig] = useState<{ [key: string]: 'asc' | 'desc' | null }>({
    email: null
  })
  const [totalElements, setTotalElements] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [usernameFilter, setUsernameFilter] = useState<string>('')
  const debouncedUsernameFilter = useDebounce(usernameFilter, 500)
  const [isFilteringUsername, setIsFilteringUsername] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const debouncedStatusFilter = useDebounce(statusFilter, 500)
  const [totalPages, setTotalPages] = useState<number>(0)

  const { data: userData, isFetching } = useUserList(
    (debouncedSearchValue || Object.keys(columnFilters).length > 0) ? 0 : pagination.pageIndex,
    (debouncedSearchValue || Object.keys(columnFilters).length > 0) ? 1000 : pagination.pageSize
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
    if (columnId === 'userName') {
      setUsernameFilter(value)
      setIsFilteringUsername(true)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
      return
    }

    setColumnFilters(prev => {
      const newFilters = { ...prev }
      if (newFilters[columnId] === value) {
        delete newFilters[columnId]
      } else {
        newFilters[columnId] = value
      }
      return newFilters
    })
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'userName',
      header: 'Username',
      filterFn: fuzzyFilter
    },
    {
      accessorKey: 'email',
      header: 'Email',
      filterFn: fuzzyFilter
    },
    {
      accessorKey: 'isActived',
      header: 'Status',
      filterFn: fuzzyFilter
    },
    {
      accessorKey: 'roleName',
      header: 'Role',
      filterFn: fuzzyFilter
    }
  ], [])

  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    if (userData?.users) {
      let filteredData = [...userData.users]

      Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
        if (filterValue && columnId !== 'userName') {
          if (columnId === 'isActived') {
            filteredData = filteredData.filter(item => {
              return String(item.isActived) === filterValue
            })
          } else {
            filteredData = filteredData.filter(item => {
              const value = String(item[columnId as keyof User] || '').toLowerCase()
              return value.includes(filterValue.toLowerCase())
            })
          }
        }
      })

      if (debouncedSearchValue) {
        filteredData = filteredData.filter(user => {
          const matchesEmail = user.email?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesEmail
        })
      }

      if (debouncedUsernameFilter) {
        filteredData = filteredData.filter(user => {
          const matchesUsername = user.userName?.toLowerCase().includes(debouncedUsernameFilter.toLowerCase())
          return matchesUsername
        })
      }

      if (debouncedSearchValue || Object.keys(columnFilters).length > 0) {
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
        setTotalElements(userData.page?.totalElements || filteredData.length)
        setTotalPages(userData.page?.totalPages || Math.ceil(filteredData.length / pagination.pageSize))
      }
    }
  }, [userData, columnFilters, debouncedSearchValue, debouncedUsernameFilter, pagination])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
              placeholder="Search emails..."
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
          <Dialog open={dialogsOpen.add ?? false} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white dark:bg-primary/10 dark:text-primary">
                <CirclePlus className="mr-2 h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[32rem]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Fill in the required details to create a new user profile.
                </DialogDescription>
              </DialogHeader>
              <AddUserForm onClose={() => closeDialog('add')} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  Username
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>
                        Filter by
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleSort('userName')}>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('userName')}>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-2 w-full relative">
                          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4' />
                          <Input
                            placeholder="Search by username..."
                            className="flex-grow pl-8 pr-2.5"
                            value={usernameFilter}
                            onChange={(e) => handleFilter('userName', e.target.value)}
                          />
                          {isFilteringUsername && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              <Loader className="dark:stroke-white" size="1.15rem" />
                            </div>
                          )}
                        </div>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                        {!data.length && <NoMatchingMessage value={usernameFilter} />}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Email
                  {sortConfig.email === 'asc' ? (
                    <ArrowUpAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('email')} />
                  ) : sortConfig.email === 'desc' ? (
                    <ArrowDownAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('email')} />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" onClick={() => handleSort('email')} />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Status
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>
                        Filter by
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleSort('isActived')}>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('isActived')}>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-3 w-full flex flex-col items-start gap-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="active"
                              checked={columnFilters['isActived'] === 'true'}
                              onCheckedChange={() => handleFilter('isActived', 'true')}
                            />
                            <label
                              htmlFor="active"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Active
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="inactive"
                              checked={columnFilters['isActived'] === 'false'}
                              onCheckedChange={() => handleFilter('isActived', 'false')}
                            />
                            <label
                              htmlFor="inactive"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Role
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>
                        Filter by
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleSort('roleName')}>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('roleName')}>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-3 w-full flex flex-col items-start gap-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="admin"
                              checked={columnFilters['roleName'] === 'Admin'}
                              onCheckedChange={() => handleFilter('roleName', 'Admin')}
                            />
                            <label
                              htmlFor="admin"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Admin
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="employee"
                              checked={columnFilters['roleName'] === 'Employee'}
                              onCheckedChange={() => handleFilter('roleName', 'Employee')}
                            />
                            <label
                              htmlFor="employee"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Employee
                            </label>
                          </div>
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <TableRow>
                  <TableCell className="w-full flex flex-col items-center justify-center">
                    There was an error! Please try again.
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
                      onClick={() => resetErrorBoundary()}
                    >
                      Try again
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            >
              {isFetching ? (
                <UsersDataLoading />
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                    {debouncedSearchValue ? (
                      <div className="flex flex-col items-center gap-1">
                        <span>
                          No users found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                        </span>
                        <span className="text-sm">
                          Try adjusting your search to find what you&apos;re looking for.
                        </span>
                      </div>
                    ) : (
                      'No users available.'
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
                          <span>There was an error loading the users data.</span>
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
                  <UserDataMain
                    data={data}
                    table={table}
                  />
                </ErrorBoundary>
              )}
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        itemName="user"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </section>
  )
}