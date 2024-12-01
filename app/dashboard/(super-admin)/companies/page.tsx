'use client'

import { Suspense, useState } from 'react'

import { CompanyDto, UpdateCompanyCommand } from '@/app/api/web-api-client'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useDeleteCompany } from '@/hooks/company/useDeleteCompany'
import { useGetCompanyList } from '@/hooks/company/useGetCompanyList'
import { useDialog } from '@/hooks/useDialog'

import { CompanyTable } from './companies-table'
import { CompanyCreate } from './company-create'
import { CompanyUpdate } from './company-update'

export default function CompaniesPage() {
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false,
    edit: false,
    delete: false
  })

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<CompanyDto | null>(null)

  const { data: companies, refetch } = useGetCompanyList()
  const deleteCompanyMutation = useDeleteCompany()

  const handleEdit = (company: CompanyDto) => {
    if (company.companyId) {
      setEditingCompanyId(company.companyId)
      setDialogsOpen(prev => ({ ...prev, edit: true }))
    }
  }

  const handleDelete = (company: CompanyDto) => {
    setDeletingCompany(company)
    setDialogsOpen(prev => ({ ...prev, delete: true }))
  }

  const confirmDelete = async () => {
    if (deletingCompany?.companyId) {
      await deleteCompanyMutation.mutateAsync(deletingCompany.companyId)
      setDialogsOpen(prev => ({ ...prev, delete: false }))
      refetch()
    }
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Companies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Companies Management</h1>
            <p className="text-muted-foreground">Manage company information here.</p>
          </div>
          <Dialog open={dialogsOpen.add} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
            <DialogTrigger asChild>
              <Button>Add Company</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Company</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new company.
                </DialogDescription>
              </DialogHeader>
              <Suspense fallback={<DashboardFetchLoader />}>
                <CompanyCreate onClose={() => closeDialog('add')} />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6">
          <CompanyTable
            companies={companies.companyList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompanyId && (
            <Suspense fallback={<DashboardFetchLoader />}>
              <CompanyUpdate
                companyId={editingCompanyId}
                onSuccess={() => {
                  refetch()
                  setDialogsOpen(prev => ({ ...prev, edit: false }))
                }}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingCompany?.companyName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDialogsOpen(prev => ({ ...prev, delete: false }))}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}