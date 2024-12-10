'use client'

import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import dynamic from 'next/dynamic'

import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { TableCell, TableRow } from '@/components/ui/table'
import { useActiveEmployee, useDeleteEmployee } from '@/hooks/employee'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { Employee } from '@/types'

const EmployeesUpdate = dynamic(() => import('./employees-update'), { 
  ssr: false,
  loading: () => <DashboardFetchLoader />
})

interface EmployeesDataProps {
  data: Employee[]
  table: any
}

export default function EmployeesData({ data, table }: EmployeesDataProps) {
  const {
    dialogsOpen,
    itemRef,
    openDialog,
    closeDialog,
    setDialogsOpen
  } = useDialog<Employee>({
    edit: false,
    delete: false
  })

  const activateEmployeeMutation = useActiveEmployee()
  const deleteEmployeeMutation = useDeleteEmployee(() => {
    closeDialog('delete')
  })

  const handleToggleActive = async (employee: any) => {
    try {
      await activateEmployeeMutation.mutateAsync({
        id: employee.id!,
        active: !employee.isActived
      })
    } catch (error) {
      console.error('Error toggling employee status:', error)
    }
  }

  const handleDelete = async () => {
    if (itemRef.current) {
      await deleteEmployeeMutation.mutateAsync(itemRef.current.id!)
    }
  }

  const rows = table.getRowModel().rows

  return (
    <>
      {rows.map((row: any) => {
        const employee = row.original
        return (
          <TableRow key={employee.id || row.id} className="border-b border-border/50 hover:bg-accent/5">
            <TableCell className="text-center py-[.75rem]">
              <div className="w-[8rem] mx-auto truncate">
                {employee.userName}
              </div>
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              <div className="w-[10rem] mx-auto truncate">
                {employee.email}
              </div>
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              <div className="w-[6rem] mx-auto truncate">
                {employee.phoneNumber}
              </div>
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              <div className="flex items-center justify-center gap-2">
                <Switch
                  checked={employee.isActived}
                  onCheckedChange={() => handleToggleActive(employee)}
                  disabled={activateEmployeeMutation.isPending}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                    employee.isActived 
                      ? 'bg-primary/90 dark:bg-primary/80'
                      : 'bg-destructive/90 dark:bg-destructive/80',
                    activateEmployeeMutation.isPending && 'opacity-50 cursor-not-allowed',
                    '[&>span]:bg-white dark:[&>span]:bg-white'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium w-[4rem] truncate',
                    employee.isActived 
                      ? 'text-primary dark:text-primary' 
                      : 'text-destructive dark:text-red-500'
                  )}
                >
                  {employee.isActived ? 'Active' : 'Inactive'}
                </span>
              </div>
            </TableCell>
            <TableCell className="py-[.75rem]">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openDialog('edit', employee)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openDialog('delete', employee)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )
      })}

      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent className="max-w-[55rem]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Make changes to employee details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {itemRef.current && (
            <EmployeesUpdate
              id={itemRef.current.id ?? ''}
              onClose={() => closeDialog('edit')}
              isOpen={dialogsOpen.edit ?? false}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeDialog('delete')}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEmployeeMutation.isPending}
            >
              {deleteEmployeeMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}