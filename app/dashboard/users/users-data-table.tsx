'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUpDown, Pencil, Trash, CirclePlus } from 'lucide-react'
// import { toast } from 'sonner'

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { User } from '@/types'

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/dashboard/superadmin/users/list')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await response.json()
  return data
}

export function UsersDataTable() {
  const { isPending, isError, error, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const userList = Array.isArray(users) ? users : []

  return (
    <div className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter emails..."
            className="min-w-[20rem]"
          />
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white dark:bg-primary/10 dark:text-primary">
                <CirclePlus className="mr-2 h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[26.5rem]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Fill in the required details to create a new user profile.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="w-full flex items-center gap-4">
                  <Label htmlFor="username" className="w-[35%]">
                    Username
                  </Label>
                  <div className="w-full">
                    <Input id="username" className="w-full" autoComplete="off" />
                  </div>
                </div>
                <div className="w-full flex items-center gap-4">
                  <Label htmlFor="email" className="w-[35%]">
                    Email
                  </Label>
                  <div className="w-full">
                    <Input id="email" className="w-full" autoComplete="off" />
                  </div>
                </div>
                <div className="w-full flex items-center gap-4">
                  <Label htmlFor="password" className="w-[35%]">
                    Password
                  </Label>
                  <div className="w-full">
                    <Input id="password" className="w-full" autoComplete="off" />
                  </div>
                </div>
                <div className="w-full flex items-center gap-4">
                  <Label htmlFor="status" className="w-[35%]">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full flex items-center gap-4">
                  <Label htmlFor="role" className="w-[35%]">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Customer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  Username
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Role
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[10rem]" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-[15rem]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[6rem]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[8rem]" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {error?.message}
                </TableCell>
              </TableRow>
            ) : userList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground hover:bg-transparent">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[26.5rem]">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Make changes to user details here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <div className="w-full flex items-center gap-4">
                            <Label htmlFor="edit-username" className="w-[35%]">
                              Username
                            </Label>
                            <div className="w-full">
                              <Input id="edit-username" className="w-full" autoComplete="off" />
                            </div>
                          </div>
                          <div className="w-full flex items-center gap-4">
                            <Label htmlFor="edit-email" className="w-[35%]">
                              Email
                            </Label>
                            <div className="w-full">
                              <Input id="edit-email" className="w-full" autoComplete="off" />
                            </div>
                          </div>
                          <div className="w-full flex items-center gap-4">
                            <Label htmlFor="edit-password" className="w-[35%]">
                              Password
                            </Label>
                            <div className="w-full">
                              <Input id="edit-password" className="w-full" autoComplete="off" />
                            </div>
                          </div>
                          <div className="w-full flex items-center gap-4">
                            <Label htmlFor="edit-status" className="w-[35%]">
                              Status
                            </Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-full flex items-center gap-4">
                            <Label htmlFor="edit-role" className="w-[35%]">
                              Role
                            </Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="user">Customer</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="reset" variant="outline" className="bg-none border-none text-black dark:bg-[#1c1c22] dark:text-[#d8d8d8]">Reset</Button>
                          <Button type="submit" className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
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
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center justify-between mt-[1.25rem]">
        <p className="text-[.85rem] text-muted-foreground">Showing 1 to 5 of 5 users</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}