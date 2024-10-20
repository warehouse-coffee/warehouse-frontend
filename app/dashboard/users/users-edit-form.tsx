import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'
import { Loader } from '@/components/ui/loader'
import { UpdateUser } from '@/types'

const updateUser = async (data: UpdateUser) => {
  const response = await fetch('/api/dashboard/superadmin/users/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

export default function UsersEditForm({ user, onClose, isOpen }: { user: UpdateUser, onClose: () => void, isOpen: boolean }) {
  const queryClient = useQueryClient()

  const [editForm, setEditForm] = useState<UpdateUser | null>(null)
  const initialFormRef = useRef<UpdateUser | null>(null)

  useEffect(() => {
    if (user && isOpen) {
      const formData = { ...user }
      setEditForm(formData)
      initialFormRef.current = formData
    }
  }, [user, isOpen])

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
      onClose()
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`)
      onClose()
    }
  })

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editForm) return
    updateUserMutation.mutate(editForm)
  }

  const handleResetForm = () => {
    if (initialFormRef.current) {
      setEditForm({ ...initialFormRef.current })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: any) => {
    setEditForm(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (!editForm) return null

  return (
    <form onSubmit={handleUpdateUser}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-id" className="flex-[0_0_35%]">User ID</Label>
          <div className="flex-1">
            <Input id="edit-id" name="id" className="w-full" autoComplete="off" value={editForm.id} disabled />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-userName" className="flex-[0_0_35%]">User Name</Label>
          <div className="flex-1">
            <Input id="edit-userName" name="userName" className="w-full" autoComplete="off" value={editForm.userName} onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-email" className="flex-[0_0_35%]">Email</Label>
          <div className="flex-1">
            <Input id="edit-email" name="email" className="w-full" autoComplete="off" value={editForm.email} onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-password" className="flex-[0_0_35%]">Password</Label>
          <div className="flex-1">
            <Input id="edit-password" name="password" type="password" className="w-full" autoComplete="off" value={editForm.password} onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-status" className="flex-[0_0_35%]">Status</Label>
          <div className="flex-1">
            <Select value={editForm.isActive ? 'active' : 'inactive'} onValueChange={(value) => handleSelectChange('isActive', value === 'active')}>
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="edit-role" className="flex-[0_0_35%]">Role</Label>
          <div className="flex-1">
            <Select value={editForm.roleName} onValueChange={(value) => handleSelectChange('roleName', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Super-Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={handleResetForm}>Reset</Button>
        <Button 
          type="submit" 
          className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${updateUserMutation.isPending ? 'flex items-center gap-3 cursor-wait pointer-events-none' : ''}`}
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