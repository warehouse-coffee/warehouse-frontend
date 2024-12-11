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
import { cn, formatRoleLabel } from '@/lib/utils'
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
  <TableCell className="text-right py-[.75rem]">
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

  return (
    <>
      {table.getRowModel().rows.map((row: Row<User>) => (
        <TableRow key={row.original.id} className="border-b border-border/50 hover:bg-accent/5">
          <TableCell className="py-[.75rem]">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={row.original.avatarImage as string}
                  alt={row.original.userName}
                  className="w-8 h-8"
                />
                <AvatarFallback className="w-8 h-8">
                  {row.original.userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium truncate max-w-[300px]">{row.original.userName}</span>
            </div>
          </TableCell>
          <TableCell className="py-[.75rem]">
            <span className="truncate block max-w-[300px]">{row.original.email}</span>
          </TableCell>
          <TableCell className="py-[.75rem]">
            {row.original.isActived ? (
              <Badge variant="outline" className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-red-500">
                Inactive
              </Badge>
            )}
          </TableCell>
          <TableCell className="py-[.75rem]">
            <Badge variant="outline" className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
              {formatRoleLabel(row.original.roleName ?? '')}
            </Badge>
          </TableCell>
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
        <DialogContent className="max-w-[55rem]">
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
              Are you sure you want to delete {userRef.current?.userName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className={cn('bg-accent')} type="button" variant="outline" onClick={() => closeDialog('delete')}>Cancel</Button>
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