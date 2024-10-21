import React, { useState, useEffect, useRef, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROLE_NAMES, RoleName } from '@/constants'
import { useUpdateUser } from '@/hooks/user'
import { cn, formatLabel } from '@/lib/utils'
import { UpdateUser } from '@/types'

type EditFormType = UpdateUser & { password: string }

export default function UsersEditForm({ user, onClose, isOpen }: { user: UpdateUser, onClose: () => void, isOpen: boolean }) {
  const [editForm, setEditForm] = useState<EditFormType>({ ...user, password: '' })
  const initialFormRef = useRef<EditFormType>({ ...user, password: '' })

  const updateUserMutation = useUpdateUser(onClose)

  useEffect(() => {
    if (user && isOpen) {
      setEditForm({ ...user, password: '' })
      initialFormRef.current = { ...user, password: '' }
    }
  }, [user, isOpen])

  const handleUpdateUser = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updateData: Partial<UpdateUser> = { ...editForm }

    if (editForm.password) {
      updateData.password = editForm.password
    }

    updateUserMutation.mutate(updateData as UpdateUser)
  }, [editForm, updateUserMutation])

  const handleResetForm = useCallback(() => {
    setEditForm(initialFormRef.current)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: any) => {
    setEditForm(prev => ({ ...prev, [name]: value }))
  }, [])

  if (!editForm) return null

  return (
    <form onSubmit={handleUpdateUser}>
      <div className="flex flex-col gap-4">
        {Object.entries(editForm).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <Label htmlFor={`edit-${key}`} className="flex-[0_0_35%]">{formatLabel(key)}</Label>
            <div className="flex-1">
              {key === 'id' ? (
                <Input id={`edit-${key}`} name={key} className="w-full" autoComplete="off" value={value as string} disabled />
              ) : key === 'roleName' ? (
                <Select value={value as RoleName} onValueChange={(newValue) => handleSelectChange(key, newValue)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ROLE_NAMES).map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : key === 'isActived' ? (
                <Select value={value ? 'active' : 'inactive'} onValueChange={(newValue) => handleSelectChange(key, newValue === 'active')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`edit-${key}`}
                  name={key}
                  type={key === 'password' ? 'password' : key === 'phoneNumber' ? 'number' : 'text'}
                  className="w-full"
                  autoComplete="off"
                  value={value as string}
                  onChange={handleInputChange}
                  placeholder={key === 'password' ? 'Leave blank to keep current password' : ''}
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
            updateUserMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {updateUserMutation.isPending ? (
            <>
              Saving...
              <Loader color="#62c5ff" size="1.25rem" />
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}