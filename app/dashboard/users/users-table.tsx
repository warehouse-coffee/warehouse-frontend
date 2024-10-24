'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ArrowUpDown, CirclePlus, ArrowUpAZ, ArrowDownAZ } from 'lucide-react'
import React, { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import DashboardDataSkeleton from '@/components/dashboard/dashboard-data-skeleton'
import { Button } from '@/components/ui/button'
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'

import AddUserForm from './add-user-form'
import UsersData from './users-data'

export default function UsersTable() {
  const { reset } = useQueryErrorResetBoundary()

  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })

  return (
    <div className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter emails..."
            className="min-w-[20rem]"
          />
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
                        {/* <DropdownMenuItem>
                          <Input placeholder="Search..." className="w-full" />
                        </DropdownMenuItem> */}
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
                        {/* <DropdownMenuItem>
                          <Input placeholder="Search..." className="w-full" />
                        </DropdownMenuItem> */}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Role
                  <ArrowUpDown className="h-4 w-4" />
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
                  <TableCell className="flex flex-col items-center justify-center">
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
              <Suspense fallback={<DashboardDataSkeleton />}>
                <UsersData />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center justify-between mt-[1.25rem]">
        <p className="text-[.85rem] text-muted-foreground">Showing 1 to 5 of 5 users</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}