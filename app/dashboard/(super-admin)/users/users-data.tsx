import { Row } from '@tanstack/react-table'
import { Eye, Pencil, Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'

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
import { useDeleteUser } from '@/hooks/user'
import { formatRoleLabel } from '@/lib/utils'
import { UpdateUser, User, UserDetail } from '@/types'

const UsersDetailDialog = dynamic(() => import('./users-detail'), {
  ssr: false,
  loading: () => <DashboardFetchLoader />
})

const UsersEditForm = dynamic(() => import('./users-edit-form'), {
  ssr: false,
  loading: () => <DashboardFetchLoader />
})

interface UsersDataProps {
  data: User[]
  table: any
}

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

export default function UsersData({
  data,
  table
}: UsersDataProps) {

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
      deleteUserMutation.mutate(userRef.current.id ?? '')
    }
  }, [deleteUserMutation, userRef])

  if (table.getRowModel().rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
          {table.getState().globalFilter ? (
            <div className="flex flex-col items-center gap-1">
              <span>
                No users found matching &quot;<span className="font-medium">{table.getState().globalFilter}</span>&quot;
              </span>
              <span className="text-sm">
                Try adjusting your search to find what you&apos;re looking for.
              </span>
            </div>
          ) : (
            'No users available.'
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {table.getRowModel().rows.map((row: Row<User>) => (
        <TableRow key={row.original.id}>
          <TableCell className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={row.original.avatarImage} alt={row.original.userName} />
              <AvatarFallback>
                {row.original.userName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {row.original.userName}
          </TableCell>
          <TableCell>{row.original.email}</TableCell>
          <TableCell>
            {row.original.isActived ? (
              <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
                Inactive
              </Badge>
            )}
          </TableCell>
          <TableCell>{formatRoleLabel(row.original.roleName ?? '')}</TableCell>
          <UserActions
            user={row.original}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </TableRow>
      ))}

      <Dialog open={dialogsOpen.detail} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, detail: open }))}>
        <DialogContent className="max-w-[35rem]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View user details here.
            </DialogDescription>
          </DialogHeader>
          {userRef.current && (
            <UsersDetailDialog user={userRef.current as UserDetail} onClose={() => closeDialog('detail')} />
          )}
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
          {userRef.current && (
            <UsersEditForm
              user={userRef.current as UpdateUser}
              onClose={() => closeDialog('edit')}
              isOpen={dialogsOpen.edit ?? false}
            />
          )}
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