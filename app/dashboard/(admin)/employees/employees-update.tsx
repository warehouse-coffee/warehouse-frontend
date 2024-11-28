import { Search } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import { EmployeeDetailVM, StorageDto2, UpdateEmployeeCommand } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEmployeeDetail, useUpdateEmployee } from '@/hooks/employee'
import { useUserStorageList } from '@/hooks/storage'

interface Storage {
  id: number;
  name: string;
  status: 'Active' | 'Inactive' | 'UnderMaintenance';
}
// const mockEmployee = {
//   id: '1712edcd-af62-4d9a-98c4-a344b4040409',
//   userName: 'AdminCAO12@ute.com',
//   email: 'AdminCAO12@gmail.com',
//   phoneNumber: 'dsadasd',
//   companyId: 'HCMUTE',
//   companyName: 'Ho Chi Minh City University of Technology and Education',
//   companyPhone: '+84 28 3896 8641',
//   companyEmail: 'contact@hcmute.edu.vn',
//   companyAddress: '1 Vo Van Ngan Street, Linh Chieu Ward, Thu Duc City, Ho Chi Minh City, Vietnam',
//   userStorages: [4, 5], // IDs of storages assigned to the user
//   allStorages: [
//     { id: 4, name: 'asterisk asdsa', address: null, status: 'Active' },
//     { id: 5, name: 'warehouse 22112', address: null, status: 'Active' },
//     ...Array.from({ length: 10 }, (_, i) => ({
//       id: i + 6,
//       name: `Storage ${i + 1}`,
//       address: null,
//       status: i % 2 === 0 ? 'Active' : 'Inactive'
//     }))
//   ]
// }

export default function EmployeesUpdatePage({ id, onClose, isOpen }: { id: string, onClose: () => void, isOpen: boolean }) {
  const { data } = useEmployeeDetail(id)
  const [employee, setEmployee] = useState<EmployeeDetailVM | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedStorages, setSelectedStorages] = React.useState<number[]>([])
  // storages
  const { data: userStorageList } = useUserStorageList(currentPage, 5)
  const storages: StorageDto2[] = userStorageList?.storages || []
  const updateEmployeeMutation = useUpdateEmployee(onClose)
  // set page and storage
  React.useEffect(() => {
    if (data) {
      setEmployee(data)
      data.storages?.forEach(element => {
        setSelectedStorages((prev) => [...prev, element.id].filter((id): id is number => id !== undefined))
      })
    }
  }, [data])

  const filteredStorages = storages.filter((storage) =>
    (storage.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStorages = filteredStorages.slice(startIndex, endIndex)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = new UpdateEmployeeCommand({
      userName: formData.get('username') as string || '',
      password: formData.get('password') as string | undefined,
      email: formData.get('email') as string || undefined,
      phoneNumber: formData.get('phoneNumber') as string | undefined,
      warehouses: selectedStorages
    })
    updateEmployeeMutation.mutate(data)
  }
  const getStatusColor = (status: Storage['status']) => {
    switch (status) {
    case 'Active':
      return 'text-green-500'
    case 'Inactive':
      return 'text-red-500'
    case 'UnderMaintenance':
      return 'text-orange-500'
    default:
      return 'text-gray-500'
    }
  }
  const commonTabContentStyle = 'space-y-6 bg-white p-6 rounded-lg shadow-sm dark:bg-primary/10 dark:text-primary min-h-[400px]'
  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user">Employee Information</TabsTrigger>
            <TabsTrigger value="company">Company Information</TabsTrigger>
          </TabsList>
          <TabsContent value="user" className={commonTabContentStyle}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID: {employee?.id}</p>
                  <div>
                    <Label htmlFor="username" className="block mb-1">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      required
                      placeholder="Enter username"
                      className="w-full"
                      value={employee?.userName || ''}
                      onChange={(e) => setEmployee(employee ? { ...employee, userName: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="block mb-1">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter password"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-1">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter email"
                      className="w-full"
                      value={employee?.email || ''}
                      onChange={(e) => setEmployee(employee ? { ...employee, email: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="block mb-1">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      className="w-full"
                      value={employee?.phoneNumber || ''}
                      onChange={(e) => setEmployee(employee ? { ...employee, phoneNumber: e.target.value, init: employee.init, toJSON: employee.toJSON } : null)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Storages</h2>
                  <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search storages..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <div className="max-h-[220px] overflow-y-auto">
                      {currentStorages.map((storage) => (
                        <div
                          key={storage.id}
                          className="flex items-center justify-between p-2 hover:bg-muted even:bg-gray-50 dark:even:bg-gray-800"
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
                            <label
                              htmlFor={`storage-${storage.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {storage.name}
                            </label>
                          </div>
                          <span className={'text-storage.status : "text-gray-500"}'}>
                            {storage.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                    Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                    Next
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="bg-primary text-white hover:bg-primary/90 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20">
                Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="company" className={commonTabContentStyle}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Company Information</h2>
              <div>
                <Label htmlFor="companyName" className="block mb-1">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-800"
                  value={employee?.companyName || ''}
                />
              </div>
              <div>
                <Label htmlFor="companyPhone" className="block mb-1">Company Phone</Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-800"
                  value={employee?.companyPhone || ''}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail" className="block mb-1">Company Email</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-800"
                  value={employee?.companyEmail || ''}
                />
              </div>
              <div>
                <Label htmlFor="companyAddress" className="block mb-1">Company Address</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-800"
                  value={employee?.companyAddress || 'N/A'}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}