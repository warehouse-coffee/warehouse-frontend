import { Eye, EyeOff } from 'lucide-react'
import React, { useState, useRef, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetCompanyList } from '@/hooks/company'
import { useCreateUser } from '@/hooks/user'
import { cn, formatLabel, formatRoleLabel, getAvailableRoles } from '@/lib/utils'
import { Company, CreateUserInput, RoleName } from '@/types'

const initialFormState: CreateUserInput = {
  userName: '',
  password: '',
  email: '',
  phoneNumber: '',
  companyId: '',
  roleName: ''
}

export default function AddUserForm({ onClose }: { onClose: () => void }) {
  const [createForm, setCreateForm] = useState<CreateUserInput>(initialFormState)
  const [showPassword, setShowPassword] = useState(false)
  const initialFormRef = useRef<CreateUserInput>(initialFormState)

  const createUserMutation = useCreateUser(onClose)

  const { data: companyData } = useGetCompanyList()

  const companyList = companyData?.companyList || []

  const handleCreateUser = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const createData: CreateUserInput = { ...createForm }
    createUserMutation.mutate(createData)
    // console.log(createData)
  }, [createForm, createUserMutation])

  const handleResetForm = useCallback(() => {
    setCreateForm({ ...initialFormRef.current })
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCreateForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const availableRoles = getAvailableRoles()

  return (
    <form onSubmit={handleCreateUser}>
      <div className="flex flex-col gap-4">
        {Object.entries(createForm).map(([key, value]) => (
          <div key={key} className="w-full flex items-center gap-4">
            <Label htmlFor={key} className="w-[35%]">
              {formatLabel(key)} <span className="text-red-500">*</span>
            </Label>
            <div className="w-full">
              {key === 'roleName' ? (
                <Select
                  required
                  value={value as RoleName}
                  onValueChange={(newValue) => setCreateForm(prev => ({ ...prev, [key]: newValue as RoleName }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>{formatRoleLabel(role)}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : key === 'password' ? (
                <div className="relative">
                  <Input
                    required
                    id={key}
                    name={key}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pr-10"
                    autoComplete="new-password"
                    value={value}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm leading-5"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-[#fff]" /> : <Eye className="h-4 w-4 text-[#fff]" />}
                  </button>
                </div>
              ) : key === 'companyId' ? (
                <Select
                  required
                  value={value}
                  onValueChange={(newValue) => setCreateForm(prev => ({ ...prev, [key]: newValue }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companyList.map((company: Company) => (
                        <SelectItem key={company.companyId} value={company.companyId}>
                          {company.companyId}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  required
                  id={key}
                  name={key}
                  type={key === 'phoneNumber' ? 'number' : 'text'}
                  className="w-full"
                  autoComplete="off"
                  value={value}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" className={cn('bg-accent')} onClick={handleResetForm}>
          Reset
        </Button>
        <Button
          type="submit"
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            createUserMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {createUserMutation.isPending ? (
            <>
              Adding...
              <Loader size="1.25rem" />
            </>
          ) : (
            'Add user'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}