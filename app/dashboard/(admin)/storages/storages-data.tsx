import { Row } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'

import { StorageDto2 } from '@/app/api/web-api-client'
import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Badge } from '@/components/ui/badge'
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
import {
  TableCell,
  TableRow
} from '@/components/ui/table'
import { useDeleteStorage } from '@/hooks/storage'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'

const UpdateStorageForm = dynamic(() => import('./update-storage'), {
  ssr: false,
  loading: () => <DashboardFetchLoader />
})

interface StorageDataProps {
  data: StorageDto2[]
  table: any
}

const StorageActions = React.memo(({ storage, onEdit, onDelete }: {
  storage: StorageDto2,
  onEdit: (storage: StorageDto2) => void,
  onDelete: (storage: StorageDto2) => void
}) => (
  <TableCell className="text-right py-[.75rem]">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onEdit(storage)}
    >
      <Pencil className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onDelete(storage)}
    >
      <Trash className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  </TableCell>
))
StorageActions.displayName = 'StorageActions'

export default function StorageData({
  data,
  table
}: StorageDataProps) {
  const {
    dialogsOpen,
    itemRef: storageRef,
    openDialog,
    closeDialog,
    setDialogsOpen
  } = useDialog<StorageDto2>({
    edit: false,
    delete: false
  })

  const deleteStorageMutation = useDeleteStorage(() => {
    closeDialog('delete')
  })

  const handleEditStorage = useCallback((storage: StorageDto2) => {
    openDialog('edit', storage)
  }, [openDialog])

  const handleDeleteStorage = useCallback((storage: StorageDto2) => {
    openDialog('delete', storage)
  }, [openDialog])

  const confirmDeleteStorage = useCallback(() => {
    if (storageRef.current) {
      deleteStorageMutation.mutate(String(storageRef.current.id ?? ''))
    }
  }, [deleteStorageMutation, storageRef])

  return (
    <>
      {table.getRowModel().rows.map((row: Row<StorageDto2>) => (
        <TableRow key={row.original.id} className="border-b border-border/50 hover:bg-accent/5">
          <TableCell className="font-medium text-center py-[.75rem] max-w-[100px] truncate">{row.original.id}</TableCell>
          <TableCell className="text-center py-[.75rem] max-w-[200px] truncate">{row.original.name}</TableCell>
          <TableCell className="text-center py-[.75rem] max-w-[200px] truncate">{row.original.address || 'N/A'}</TableCell>
          <TableCell className="text-center py-[.75rem] max-w-[100px]">
            {row.original.status === 'Active' ? (
              <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
                Active
              </Badge>
            ) : row.original.status === 'UnderMaintenance' ? (
              <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
                Under Maintenance
              </Badge>
            ) : (
              <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
                Inactive
              </Badge>
            )}
          </TableCell>
          <StorageActions
            storage={row.original}
            onEdit={handleEditStorage}
            onDelete={handleDeleteStorage}
          />
        </TableRow>
      ))}

      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent className="max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Edit Storage</DialogTitle>
            <DialogDescription>
              Make changes to storage details here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {storageRef.current && (
            <UpdateStorageForm
              storage={storageRef.current}
              onSuccess={() => closeDialog('edit')}
              onClose={() => closeDialog('edit')}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete Storage</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {storageRef.current?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className={cn('bg-accent')} type="button" variant="outline" onClick={() => closeDialog('delete')}>Cancel</Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${deleteStorageMutation.isPending ? 'flex items-center gap-3 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={confirmDeleteStorage}
            >
              {deleteStorageMutation.isPending ? (
                <>
                  Deleting...
                  <Loader size="1.25rem" />
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