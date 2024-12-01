'use client'

import { Suspense, useState, useCallback } from 'react'
import React from 'react'

import { StorageDto2 } from '@/app/api/web-api-client'
import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useDeleteStorage } from '@/hooks/storage/useDeleteStorage'
import { useDialog } from '@/hooks/useDialog'

import { StorageTable } from './storage-table'
import StoragesCreatePage from './storages-create'
import { UpdateStorage } from './update-storage'

export default function StoragesPage() {
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })
  const [editingStorage, setEditingStorage] = useState<StorageDto2 | null>(null)
  const [deletingStorage, setDeletingStorage] = useState<StorageDto2 | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteStorage = useDeleteStorage()
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null)

  const handleEdit = (storage : StorageDto2) => {
    const storageToEdit = storage
    if (storageToEdit) {
      setEditingStorage(storageToEdit)
      setIsEditDialogOpen(true)
    }
  }
  const handleDelete = (storage: StorageDto2) => {
    const storageToDelete = storage
    if (storageToDelete) {
      setIsDeleteDialogOpen(true)
      setDeletingStorage(storageToDelete)
    }
  }

  const confirmDelete = () => {
    if (deletingStorage) {
      setIsDeleteDialogOpen(false)
      deleteStorage.mutate(String(deletingStorage.id ?? ''))
      setDeletingStorage(null)
    }
  }

  const setRefreshFunction = useCallback((fn: () => void) => {
    setRefreshFn(() => fn)
  }, [])

  return (
    <> <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Storages</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div className="mt-[.5rem]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Storages Management</h1>
          <p className="text-[.85rem] text-muted-foreground">
              Manage Storages effectively here.
          </p>
        </div>
        <button onClick={() => setDialogsOpen(prev => ({ ...prev, add: true }))} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create
        </button>
      </div>
    </div>
    <StorageTable
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={setRefreshFunction}
    />
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Storage</DialogTitle>
        </DialogHeader>
        {editingStorage && (
          <UpdateStorage
            storage={editingStorage}
            onSuccess={() => {
              if (refreshFn) {
                refreshFn()
              }
              setIsEditDialogOpen(false)
              setEditingStorage(null)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
    <Dialog open={dialogsOpen.add} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
      <DialogTrigger asChild>
        <button className="hidden"></button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle> <h1 className="text-3xl font-bold mb-2 text-gray-800">Create New Storage</h1>
          </DialogTitle>
          <DialogDescription>
            <p className="text-gray-600 mb-6">Fill in the details to create a new storage entry.</p>
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<DashboardFetchLoader />}>
          <StoragesCreatePage
            onClose={() => closeDialog('add')}
            onSuccess={() => {
              closeDialog('add')
              refreshFn?.()
            }}/>
        </Suspense>
      </DialogContent>
    </Dialog>
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
              Are you sure you want to delete the storage &quot;{deletingStorage?.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
              Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}