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

export default function UsersTable() {
  const { reset } = useQueryErrorResetBoundary()

  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [totalElements, setTotalElements] = useState<number>(0)
  const [globalSearch, setGlobalSearch] = useState<string>('')
  const debouncedGlobalSearch = useDebounce(globalSearch, 500)
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const [totalPages, setTotalPages] = useState<number>(0)

  const { data: userData } = useUserList(
    pagination.pageIndex,
    pagination.pageSize,
    debouncedGlobalSearch
  )

  const handleSearchEmail = (value: string) => {
    setGlobalSearch(value)

    if (!value.trim()) {
      if (userData?.users) {
        setData(userData.users)
      }
      return
    }

    const filteredEmail = data.filter(user => user.email?.toLowerCase().includes(value.toLowerCase()))

    if (filteredEmail.length > 0) {
      setData(filteredEmail)
      setTotalElements(filteredEmail.length)
      return
    }

    table.setGlobalFilter(value)
  }

  const columns = useMemo<ColumnDef<User>[]>(() => [
    // {
    //   accessorKey: 'userName',
    //   header: 'Username',
    //   filterFn: fuzzyFilter
    // },
    {
      accessorKey: 'email',
      header: 'Email',
      filterFn: fuzzyFilter
    }
    // {
    //   accessorKey: 'isActived',
    //   header: 'Status',
    //   filterFn: fuzzyFilter
    // },
    // {
    //   accessorKey: 'roleName',
    //   header: 'Role',
    //   filterFn: fuzzyFilter
    // }
  ], [])

  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    if (userData?.users) {
      setData(userData.users)
      setTotalElements(userData.page?.totalElements ?? 0)
      setTotalPages(userData.page?.totalPages ?? 0)
      setIsSearching(false)
    }
  }, [userData])

  useEffect(() => {
    if (debouncedGlobalSearch && userData?.users.length === 0) {
      setIsSearching(true)
    }
  }, [debouncedGlobalSearch, userData?.users.length])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      globalFilter: globalSearch
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalSearch,
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
              placeholder="Search emails..."
              className="min-w-[20rem]"
              value={globalSearch}
              onChange={(e) => handleSearchEmail(String(e.target.value))}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader color="#fff" size="1.15rem" />
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
            <DialogContent className="max-w-[30rem]">
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
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-2 w-full relative">
                          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4' />
                          <Input placeholder="Search by username..." className="flex-grow pl-8 pr-2.5" />
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Email
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
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-3 w-full flex flex-col items-start gap-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <Checkbox id="active" />
                            <label
                              htmlFor="active"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Active
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inactive" />
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
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                        <div className="mt-3 w-full flex flex-col items-start gap-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <Checkbox id="admin" />
                            <label
                              htmlFor="admin"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Admin
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="employee" />
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
              <UserDataMain
                data={data}
                table={table}
              />
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