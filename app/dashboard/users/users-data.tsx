import { Eye, Pencil, Trash } from 'lucide-react'
import React, { Suspense, useCallback, useMemo } from 'react'

import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader } from '@/components/ui/loader'
import {
  TableCell,
  TableRow
} from '@/components/ui/table'
import { useDialog } from '@/hooks/useDialog'
import { useUserList, useDeleteUser } from '@/hooks/user'
import { formatRoleLabel } from '@/lib/utils'
import { UpdateUser, User, UserDetail } from '@/types'

import UsersDetail from './users-detail'
import UsersEditForm from './users-edit-form'

const UserActions = React.memo(({ user, onView, onEdit, onDelete }: {
  user: User,
  onView: (user: User) => void,
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
}) => (
  <TableCell className="text-right">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onView(user)}
    >
      <Eye className="h-4 w-4" />
      <span className="sr-only">View Details</span>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onEdit(user)}
    >
      <Pencil className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onDelete(user)}
    >
      <Trash className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  </TableCell>
))
UserActions.displayName = 'UserActions'

export default function UsersData() {
  const { data } = useUserList()

  const {
    dialogsOpen,
    itemRef: userRef,
    openDialog,
    closeDialog,
    setDialogsOpen
  } = useDialog<User>({
    detail: false,
    edit: false,
    delete: false
  })

  const deleteUserMutation = useDeleteUser(() => {
    closeDialog('delete')
  })

  const userList = useMemo(() => data?.users ?? [], [data])

  const handleEditUser = useCallback((user: User) => {
    openDialog('edit', user)
  }, [openDialog])

  const handleViewUser = useCallback((user: User) => {
    openDialog('detail', user)
  }, [openDialog])

  const handleDeleteUser = useCallback((user: User) => {
    openDialog('delete', user)
  }, [openDialog])

  const confirmDeleteUser = useCallback(() => {
    if (userRef.current) {
      deleteUserMutation.mutate(userRef.current.id)
    }
  }, [deleteUserMutation, userRef])

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
                <AvatarImage src={user.avatarImage} alt={user.userName} />
                <AvatarFallback>{user.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {user.userName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.isActived ?
                <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">Active</Badge> :
                <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">Inactive</Badge>
              }
            </TableCell>
            <TableCell>{formatRoleLabel(user.roleName)}</TableCell>
            <UserActions
              user={user}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </TableRow>
        ))
      )}

      <Dialog open={dialogsOpen.detail} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, detail: open }))}>
        <DialogContent className="max-w-[35rem]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View user details here.
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<DashboardFetchLoader />}>
            {userRef.current && (
              <UsersDetail user={userRef.current as UserDetail} onClose={() => closeDialog('detail')} />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent className="max-w-[30rem]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user details here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<DashboardFetchLoader />}>
            {userRef.current && (
              <UsersEditForm
                user={userRef.current as UpdateUser}
                onClose={() => closeDialog('edit')}
                isOpen={dialogsOpen.edit ?? false}
              />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => closeDialog('delete')} variant="outline">Cancel</Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${deleteUserMutation.isPending ? 'flex items-center gap-3 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={confirmDeleteUser}
            >
              {deleteUserMutation.isPending ? (
                <>
                  Deleting...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}