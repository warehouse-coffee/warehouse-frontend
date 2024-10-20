import { useSuspenseQuery } from '@tanstack/react-query'
import { Eye, Pencil, Trash } from 'lucide-react'
import React, { useState, Suspense, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  TableCell,
  TableRow
} from '@/components/ui/table'
import { Loader } from '@/components/ui/loader'

import { UpdateUser, User, UserDetail } from '@/types'
import UsersDetail from './users-detail'
import UsersEditForm from './users-edit-form'

const fetchUsers = async (): Promise<{ users: User[] }> => {
  const response = await fetch('/api/dashboard/superadmin/users/list', {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await response.json()
  return data
}

export default function UsersData() {
  const { data } = useSuspenseQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const [dialogsOpen, setDialogsOpen] = useState<{
    detail: boolean,
    edit: boolean,
    delete: boolean
  }>({
    detail: false,
    edit: false,
    delete: false
  })

  const editingUserRef = useRef<User | null>(null)
  const viewingUserRef = useRef<User | null>(null)

  const userList = data?.users ?? []

  const handleEditUser = (user: User) => {
    editingUserRef.current = user
    setDialogsOpen(prev => ({ ...prev, edit: true }))
  }

  const handleCloseEditDialog = () => {
    setDialogsOpen(prev => ({ ...prev, edit: false }))
    setTimeout(() => editingUserRef.current = null, 250);
  }

  const handleViewUser = (user: User) => {
    viewingUserRef.current = user
    setDialogsOpen(prev => ({ ...prev, detail: true }))
  }

  const handleCloseViewDialog = () => {
    setDialogsOpen(prev => ({ ...prev, detail: false }))
    setTimeout(() => viewingUserRef.current = null, 250);
  }

  return (
    <>
      {userList.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground hover:bg-transparent">
            No users found.
          </TableCell>
        </TableRow>
      ) : (
        userList.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.userName} />
                <AvatarFallback>{user.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {user.userName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
            <TableCell>{user.roleName}</TableCell>
            <TableCell className="text-right">
              <Dialog open={dialogsOpen.detail} onOpenChange={(open) => {
                  setDialogsOpen(prev => ({ ...prev, detail: open }));
                }}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[35rem]">
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                      View user details here.
                    </DialogDescription>
                  </DialogHeader>
                  <Suspense fallback={
                      <div className="flex flex-col gap-4 justify-center items-center h-[20rem]">
                        <Loader color="#fff" size="2.85rem" />
                        <span className="text-[.85rem] text-black dark:text-muted">Fetching user data...</span>
                      </div>
                    }>
                      {viewingUserRef.current && (
                        <UsersDetail user={viewingUserRef.current as UserDetail} onClose={handleCloseViewDialog} />
                      )}
                    </Suspense>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[30rem]">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Make changes to user details here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <Suspense fallback={
                    <div className="flex flex-col gap-4 justify-center items-center h-[20rem]">
                      <Loader color="#fff" size="2.85rem" />
                      <span className="text-[.85rem] text-black dark:text-muted">Fetching user data...</span>
                    </div>
                  }>
                    {editingUserRef.current && (
                      <UsersEditForm 
                        user={editingUserRef.current as UpdateUser} 
                        onClose={handleCloseEditDialog} 
                        isOpen={dialogsOpen.edit}
                      />
                    )}
                  </Suspense>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[26.5rem]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to delete this user?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button type="submit" className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))
      )}
    </>
  )
}
