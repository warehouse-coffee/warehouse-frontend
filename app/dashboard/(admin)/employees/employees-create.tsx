import React, { useState } from 'react'

import { CreateEmployeeCommand, StorageDto2 } from '@/app/api/web-api-client'
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
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCreateEmployee } from '@/hooks/employee'
import { useUserStorageList } from '@/hooks/storage'
import { cn } from '@/lib/utils'

interface EmployeesCreateProps {
  onClose: () => void
}

export default function EmployeesCreate({ onClose }: EmployeesCreateProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStorages, setSelectedStorages] = useState<number[]>([])

  const { data } = useUserStorageList(currentPage, 5)
  const storages: StorageDto2[] = data.storages || []
  const filteredStorages = storages.filter((storage) =>
    storage.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStorages = filteredStorages.slice(startIndex, endIndex)

  const createEmployeeMutation = useCreateEmployee(onClose)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const data = new CreateEmployeeCommand({
      userName: formData.get('username') as string,
      password: formData.get('password') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      warehouses: selectedStorages
    })
    createEmployeeMutation.mutate(data)
  }

  const handleResetForm = () => {
    const form = document.querySelector('form')
    if (form) {
      form.reset()
      setSelectedStorages([])
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information Section */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                required
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Storages Section */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Assigned Storages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search storages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ScrollArea className="h-[200px] rounded-md border">
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
                            setSelectedStorages([
                              ...selectedStorages.filter(id => id !== undefined),
                              storage.id!
                            ])
                          } else {
                            setSelectedStorages(
                              selectedStorages.filter((id) => id !== storage.id)
                            )
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={cn(
                      'cursor-pointer select-none',
                      currentPage === 1 && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={cn(
                      'cursor-pointer select-none',
                      currentPage === totalPages && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          className={cn('bg-accent')}
          onClick={handleResetForm}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            createEmployeeMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {createEmployeeMutation.isPending ? (
            <>
              Creating...
              <Loader color="#62c5ff" size="1.25rem" />
            </>
          ) : (
            'Create Employee'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}