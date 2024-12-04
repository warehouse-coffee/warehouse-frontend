'use client'
import { Row } from '@tanstack/react-table'
import {
  Pencil,
  Trash
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import React from 'react'

import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader } from '@/components/ui/loader'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDeleteEmployee } from '@/hooks/employee'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { Employee } from '@/types'

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
const EmployeeUpdateForm = dynamic(() => import('./employees-update'), {
  ssr: false,
  loading: () => <DashboardFetchLoader />
})
export default function EmployeesData({ table }: { table: any }) {
  const {
    dialogsOpen,
    itemRef: employeeRef,
    openDialog,
    closeDialog,
    setDialogsOpen
  } = useDialog<Employee>({
    edit: false,
    delete: false
  })
  const deleteEmployeeMutation = useDeleteEmployee(() => {
    closeDialog('delete')
  })
  const handleEditEmployee = useCallback(
    (employee: Employee) => {
      openDialog('edit', employee)
    },
    [openDialog]
  )
  const handleDeleteEmployee = useCallback(
    (employee: Employee) => {
      openDialog('delete', employee)
    },
    [openDialog]
  )
  const confirmDeleteEmployee = useCallback(() => {
    if (employeeRef.current) {
      deleteEmployeeMutation.mutate(employeeRef.current.id ?? '')
    }
  }, [deleteEmployeeMutation, employeeRef])
  if (table.getRowModel().rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={5}
          className="h-24 text-muted-foreground text-center"
        >
          {table.getState().globalFilter ? (
            <div className="flex flex-col items-center gap-1">
              <span>
                No employees found matching &quot;
                <span className="font-medium">
                  {table.getState().globalFilter}
                </span>
                &quot;
              </span>
              <span className="text-sm">
                Try adjusting your search to find what you&apos;re looking for.
              </span>
            </div>
          ) : (
            'No employees available.'
          )}
        </TableCell>
      </TableRow>
    )
  }
  const getInitials = (userName: string) => {
    return userName
      .split(/[@.]/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return (
    <>
      {table.getRowModel().rows.map((row: Row<Employee>) => (
        <TableRow key={row.original.id}>
          <TableCell className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                {row.original.userName
                  ? getInitials(row.original.userName)
                  : 'NA'}
              </AvatarFallback>
            </Avatar>
            {row.original.userName}
          </TableCell>
          <TableCell>{row.original.email}</TableCell>
          <TableCell>{row.original.phoneNumber || 'N/A'}</TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                row.original.isActived
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {row.original.isActived ? 'Active' : 'Inactive'}
            </span>
          </TableCell>
          <TableCell>
            <EmployeeActions
              employee={row.original}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </TableCell>
        </TableRow>
      ))}
      <Dialog
        open={dialogsOpen.delete}
        onOpenChange={(open: any) =>
          setDialogsOpen((prev) => ({ ...prev, delete: open }))
        }
      >
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => closeDialog('delete')}
              className={cn('bg-accent')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${
                deleteEmployeeMutation.isPending
                  ? 'flex items-center gap-3 cursor-not-allowed pointer-events-none'
                  : ''
              }`}
              onClick={confirmDeleteEmployee}
            >
              {deleteEmployeeMutation.isPending ? (
                <>
                  Deleting...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent className="w-[800px] sm:w-[1000px] !max-w-none">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user details here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {employeeRef.current && (
            <EmployeeUpdateForm
              id={employeeRef.current.id ?? ''}
              onClose={() => closeDialog('edit')}
              isOpen={dialogsOpen.edit ?? false}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}