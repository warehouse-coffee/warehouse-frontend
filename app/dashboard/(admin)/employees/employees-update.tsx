import React, { useEffect, useState } from 'react'

import { EmployeeDetailVM, StorageDto2, UpdateEmployeeCommand } from '@/app/api/web-api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { TransitionPanel } from '@/components/ui/transition-panel'
import { useEmployeeDetail, useUpdateEmployee } from '@/hooks/employee'
import { useUserStorageList } from '@/hooks/storage'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 0, label: 'Employee Information' },
  { id: 1, label: 'Company Information' }
]

export default function EmployeesUpdatePage({ id, onClose, isOpen }: { id: string, onClose: () => void, isOpen: boolean }) {
  const { data : updateEmployee } = useEmployeeDetail(id)
  const [employee, setEmployee] = useState<EmployeeDetailVM | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedStorages, setSelectedStorages] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState(0)
  // storages
  const { data: userStorageList } = useUserStorageList(currentPage, 5)
  const storages: StorageDto2[] = userStorageList?.storages || []
  const updateEmployeeMutation = useUpdateEmployee(onClose)
  // set page and storage
  useEffect(() => {
    if (updateEmployee) {
      setEmployee(updateEmployee)
      updateEmployee.storages?.forEach(element => {
        setSelectedStorages((prev) => [...prev, element.id].filter((id): id is number => id !== undefined))
      })
    }
  }, [updateEmployee])

  const filteredStorages = storages.filter((storage) =>
    (storage.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStorages = filteredStorages.slice(startIndex, endIndex)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = new UpdateEmployeeCommand({
      id: id,
      userName: formData.get('username') as string || '',
      password: formData.get('password') as string | undefined,
      email: formData.get('email') as string || undefined,
      phoneNumber: formData.get('phoneNumber') as string | undefined,
      warehouses: selectedStorages
    })
    updateEmployeeMutation.mutate(data)
  }

  const variants = {
    enter: { x: 10, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -10, opacity: 0 }
  }

  const panelContent = [
    // Employee Information Panel
    <Card key="employee" className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Employee Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">ID: {employee?.id}</p>
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  required
                  placeholder="Enter username"
                  value={employee?.userName || ''}
                  onChange={(e) => setEmployee(employee ? { ...employee, userName: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter email"
                  value={employee?.email || ''}
                  onChange={(e) => setEmployee(employee ? { ...employee, email: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={employee?.phoneNumber || ''}
                  onChange={(e) => setEmployee(employee ? { ...employee, phoneNumber: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Assigned Storages</h2>
              <Input
                placeholder="Search storages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ScrollArea className="h-[240px] rounded-md border">
                <div className="p-1">
                  {currentStorages.map((storage) => (
                    <div
                      key={storage.id}
                      className="flex items-center justify-between p-2 hover:bg-accent/5 rounded-md transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-${storage.id}`}
                          checked={storage.id !== undefined && selectedStorages.includes(storage.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (storage.id !== undefined) {
                                setSelectedStorages([...selectedStorages, storage.id])
                              }
                            } else {
                              setSelectedStorages(selectedStorages.filter(id => id !== storage.id))
                            }
                          }}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label
                                htmlFor={`storage-${storage.id}`}
                                className="text-sm font-medium leading-none cursor-pointer select-none max-w-[200px] truncate"
                              >
                                {storage.name}
                              </label>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{storage.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {storage.status === 'Active' ? (
                        <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
                          Active
                        </Badge>
                      ) : storage.status === 'UnderMaintenance' ? (
                        <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
                          Under Maintenance
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Pagination>
                <PaginationContent className="w-full flex items-center justify-between">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      className={cn(
                        'cursor-pointer select-none',
                        currentPage === 0 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {currentPage + 1} of {Math.max(1, totalPages)}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      className={cn(
                        'cursor-pointer select-none',
                        currentPage >= totalPages - 1 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className={cn('bg-accent')}
              onClick={() => {
                if (updateEmployee) {
                  setEmployee(updateEmployee)
                  setSelectedStorages(updateEmployee.storages?.map(s => s.id!).filter(Boolean) || [])
                }
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className={cn(
                'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
                updateEmployeeMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
              )}
            >
              {updateEmployeeMutation.isPending ? (
                <>
                  Saving...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </CardContent>
    </Card>,

    // Company Information Panel
    <Card key="company" className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            readOnly
            className="bg-muted"
            value={employee?.companyName || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Company Phone</Label>
          <Input
            id="companyPhone"
            name="companyPhone"
            readOnly
            className="bg-muted"
            value={employee?.companyPhone || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyEmail">Company Email</Label>
          <Input
            id="companyEmail"
            name="companyEmail"
            readOnly
            className="bg-muted"
            value={employee?.companyEmail || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Input
            id="companyAddress"
            name="companyAddress"
            readOnly
            className="bg-muted"
            value={employee?.companyAddress || 'N/A'}
          />
        </div>
      </CardContent>
    </Card>
  ]

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={cn(
                'transition-all duration-250',
                activeTab === tab.id && 'bg-primary text-primary-foreground dark:bg-primary/10 dark:text-primary'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <TransitionPanel
          activeIndex={activeTab}
          variants={variants}
          transition={{ duration: 0.3 }}
        >
          {panelContent}
        </TransitionPanel>
      </div>
    </>
  )
}