'use client'

import { PaginationState } from '@tanstack/react-table'
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown, Eye } from 'lucide-react'
import { useCallback, useState } from 'react'

import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { useStorageOfUserDetail } from '@/hooks/storage'

interface InventoryItem {
  id: string
  productName: string
  availableQuantity: number
  expiration: string | null
  totalPrice: number
  totalSalePrice: number
  safeStock: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

const sampleData: InventoryItem[] = [
  {
    id: '1',
    productName: 'Arabica Coffee Beans',
    availableQuantity: 150,
    expiration: '2024-12-31',
    totalPrice: 2500000,
    totalSalePrice: 3000000,
    safeStock: 100,
    status: 'In Stock'
  },
  {
    id: '2',
    productName: 'Robusta Coffee Beans',
    availableQuantity: 80,
    expiration: '2024-11-30',
    totalPrice: 1800000,
    totalSalePrice: 2200000,
    safeStock: 100,
    status: 'Low Stock'
  },
  {
    id: '3',
    productName: 'Colombian Coffee Beans',
    availableQuantity: 0,
    expiration: '2024-10-15',
    totalPrice: 3000000,
    totalSalePrice: 3600000,
    safeStock: 50,
    status: 'Out of Stock'
  },
  {
    id: '4',
    productName: 'Ethiopian Coffee Beans',
    availableQuantity: 200,
    expiration: '2024-12-15',
    totalPrice: 2800000,
    totalSalePrice: 3400000,
    safeStock: 150,
    status: 'In Stock'
  },
  {
    id: '5',
    productName: 'Vietnamese Coffee Beans',
    availableQuantity: 45,
    expiration: '2024-11-01',
    totalPrice: 1500000,
    totalSalePrice: 1800000,
    safeStock: 50,
    status: 'Low Stock'
  }
]

export default function InventoryTable() {
  const [totalElements, setTotalElements] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [value, setValue] = useState<Record<string, string>>({})

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const { data: userStorageList } = useStorageOfUserDetail()

  const storageList = userStorageList?.storages || []

  // const handleSelectChange = useCallback((key: string, newValue: string) => {
  //   setValue({ ...value, [key]: newValue })
  // }, [])

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <Select>
          <SelectTrigger className="w-[16rem]">
            <SelectValue placeholder="Select your inventory" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select your inventory</SelectLabel>
              {!storageList.length ? (
                <SelectItem disabled aria-disabled value="None">
                  No inventory available.
                </SelectItem>
              ) : (
                storageList.map((storage) => (
                  <SelectItem key={storage.id} value={storage.id?.toString() || ''}>
                    {storage.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search products in inventory..."
              className="min-w-[20rem]"
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  Product Name
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Available Quantity
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Expiration
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                Total Price
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Sale Price
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                  Safe Stock
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-2">
                Status
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ArrowUpAZ className="mr-2 h-4 w-4" />
                          <span>Ascending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          <span>Descending</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell className="text-center">{item.availableQuantity}</TableCell>
                <TableCell className="text-center">{item.expiration ? new Date(item.expiration).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="text-center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</TableCell>
                <TableCell className="text-center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalSalePrice)}</TableCell>
                <TableCell className="text-center">{item.safeStock}</TableCell>
                <TableCell className="text-center">
                  {item.status === 'In Stock' ? (
                    <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
                      {item.status}
                    </Badge>
                  ) : item.status === 'Low Stock' ? (
                    <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
                      {item.status}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
                      {item.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    // onClick={() => onView(user)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center justify-between mt-[1.25rem]">
        <p className="text-[.85rem] text-muted-foreground">
          Showing 1 to 5 of 5 items
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  // table.previousPage()
                }}
                aria-disabled={false}
                className={'pointer-events-none opacity-50'}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  // table.setPageIndex(i)
                }}
                isActive={true}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  // table.nextPage()
                }}
                aria-disabled={false}
                className={'pointer-events-none opacity-50'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {/* <DashboardTablePagination
        itemName="item"
        table={table}
        totalElements={totalElements}
        totalPages={totalPages}
      /> */}
    </section>
  )
}