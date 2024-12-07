'use client'

import { Pencil, Trash } from 'lucide-react'
import React, { useCallback } from 'react'

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
import { useDeleteCompany } from '@/hooks/company'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { Company } from '@/types'

import CompaniesUpdate from './companies-update'

interface CompaniesDataProps {
  data: Company[]
  table: any
}

export default function CompaniesData({ data, table }: CompaniesDataProps) {
  const {
    itemRef: selectedCompany,
    openDialog,
    closeDialog,
    dialogsOpen,
    setDialogsOpen
  } = useDialog<Company>({
    detail: false,
    edit: false,
    delete: false
  })

  const deleteCompanyMutation = useDeleteCompany(() => {
    closeDialog('delete')
  })

  const handleEdit = useCallback((company: Company) => {
    openDialog('edit', company)
  }, [openDialog])

  const handleDelete = useCallback((company: Company) => {
    openDialog('delete', company)
  }, [openDialog])

  const confirmDeleteCompany = useCallback(() => {
    if (selectedCompany?.current) {
      deleteCompanyMutation.mutate(selectedCompany.current.companyId)
    }
  }, [deleteCompanyMutation, selectedCompany])

  return (
    <>
      {table.getRowModel().rows.map((row: any) => {
        const company = row.original
        return (
          <TableRow key={company.companyId}>
            <TableCell className="py-3">{company.companyId}</TableCell>
            <TableCell className={cn('py-3', !company.companyName && 'text-muted-foreground')}>
              {company.companyName ?? 'Not Updated'}
            </TableCell>
            <TableCell className={cn('py-3 text-center', !company.phoneContact && 'text-muted-foreground')}>
              {company.phoneContact ?? 'Not Updated'}
            </TableCell>
            <TableCell className="py-3 text-right">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(company)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(company)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        )
      })}

      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent className="max-w-[32rem]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company information below.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany?.current && (
            <CompaniesUpdate
              companyId={selectedCompany.current.companyId}
              onSuccess={() => closeDialog('edit')}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCompany?.current?.companyName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className={cn('bg-accent')}
              onClick={() => closeDialog('delete')}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
                deleteCompanyMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
              )}
              onClick={confirmDeleteCompany}
            >
              {deleteCompanyMutation.isPending ? (
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
    </>
  )
}