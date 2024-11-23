'use client'

import { Suspense, useState } from 'react'
import { StorageTable } from './storage-table'
import { UpdateStorage } from './update-storage'

interface Storage {
  id: number
  name: string
  address: string | null
  status: string
}

interface PageInfo {
  size: number
  pageNumber: number
  totalElements: number
  totalPages: number
  sortBy: string
  sortAsc: boolean
}

interface Data {
  storages: Storage[]
  page: PageInfo
}
const initialData = {
  storages: [
    {
      id: 1,
      name: "manufacturing A",
      address: null as string | null,
      status: "Active"
    },
    {
      id: 2,
      name: "manufacturing B",
      address: null,
      status: "Active"
    },
    {
      id: 3,
      name: "manufacturing C",
      address: null,
      status: "Active"
    }
  ],
  page: {
    size: 5,
    pageNumber: 1,
    totalElements: 3,
    totalPages: 1,
    sortBy: "id",
    sortAsc: true
  }
}

import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useDialog } from '@/hooks/useDialog'

import StoragesCreatePage from './storages-create'
import { Button } from '@/components/ui/button'

export default function StoragesPage() {
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false
  })
  const [data, setData] = useState<Data>(initialData)
  const [editingStorage, setEditingStorage] = useState<Storage | null>(null)
  const [deletingStorage, setDeletingStorage] = useState<Storage | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)


  const handleSort = (column: string) => {
    // In a real application, you would fetch sorted data from the backend
    setData(prevData => ({
      ...prevData,
      page: {
        ...prevData.page,
        sortBy: column,
        sortAsc: prevData.page.sortBy === column ? !prevData.page.sortAsc : true
      }
    }))
  }

  const handlePageChange = (pageNumber: number) => {
    // In a real application, you would fetch the new page from the backend
    setData(prevData => ({
      ...prevData,
      page: {
        ...prevData.page,
        pageNumber
      }
    }))
  }

  const handleEdit = (id: number) => {
    const storageToEdit = data.storages.find(storage => storage.id === id)
    if (storageToEdit) {
      setEditingStorage(storageToEdit)
      setDialogsOpen(prev => ({ ...prev, add: true }))
    }
  }

  const handleUpdate = (updatedStorage: Storage) => {
    // In a real application, you would send the update to the backend
    setData(prevData => ({
      ...prevData,
      storages: prevData.storages.map(storage => 
        storage.id === updatedStorage.id ? updatedStorage : storage
      )
    }))
    setDialogsOpen(prev => ({ ...prev, add: false }))
  }

  const handleDelete = (id: number) => {
    const storageToDelete = data.storages.find(storage => storage.id === id)
    if (storageToDelete) {
      setDeletingStorage(storageToDelete)
      setIsDeleteDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    if (deletingStorage) {
      // In a real application, you would send the delete request to the backend
      setData(prevData => ({
        ...prevData,
        storages: prevData.storages.filter(storage => storage.id !== deletingStorage.id)
      }))
      setIsDeleteDialogOpen(false)
      setDeletingStorage(null)
    }
  }

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
        storages={data.storages}
        page={data.page}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Storage</DialogTitle>
          </DialogHeader>
          {editingStorage && (
            <UpdateStorage
              storage={editingStorage}
              onUpdate={handleUpdate}
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
          <StoragesCreatePage onClose={() => closeDialog('add')}/>
        </Suspense>
      </DialogContent>
    </Dialog>
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the storage "{deletingStorage?.name}"? This action cannot be undone.
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