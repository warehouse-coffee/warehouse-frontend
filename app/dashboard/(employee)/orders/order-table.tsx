"use client"

import { useState, useEffect } from 'react'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"

interface Order {
  orderId: string
  type: string
  date: string
  totalPrice: number
  orderDetailsCount: number
  totalQuantity: number
}

interface Page {
  size: number
  pageNumber: number
  totalElements: number
  totalPages: number
  sortBy: string
  sortAsc: boolean
}

interface OrderTableProps {
  initialOrders: Order[]
  initialPage: Page
}

export default function OrderTable({ initialOrders, initialPage }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [page, setPage] = useState<Page>(initialPage)
  const [sortColumn, setSortColumn] = useState<string>(initialPage.sortBy)
  const [sortAsc, setSortAsc] = useState<boolean>(initialPage.sortAsc)
  const [filters, setFilters] = useState({
    orderId: '',
    type: 'all',
    date: '',
    totalPrice: '',
    orderDetailsCount: '',
    totalQuantity: ''
  })

  useEffect(() => {
    let filteredOrders = [...initialOrders]

    // Apply filters
    if (filters.orderId) {
      filteredOrders = filteredOrders.filter(order => order.orderId.toLowerCase().includes(filters.orderId.toLowerCase()))
    }
    if (filters.type !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.type === filters.type)
    }
    if (filters.date) {
      filteredOrders = filteredOrders.filter(order => order.date.startsWith(filters.date))
    }
    if (filters.totalPrice) {
      filteredOrders = filteredOrders.filter(order => order.totalPrice.toString().includes(filters.totalPrice))
    }
    if (filters.orderDetailsCount) {
      filteredOrders = filteredOrders.filter(order => order.orderDetailsCount.toString().includes(filters.orderDetailsCount))
    }
    if (filters.totalQuantity) {
      filteredOrders = filteredOrders.filter(order => order.totalQuantity.toString().includes(filters.totalQuantity))
    }

    // Sort
    filteredOrders.sort((a, b) => {
      const aValue = a[sortColumn as keyof Order]
      const bValue = b[sortColumn as keyof Order]
      if (aValue < bValue) return sortAsc ? -1 : 1
      if (aValue > bValue) return sortAsc ? 1 : -1
      return 0
    })

    setOrders(filteredOrders)
    setPage({
      ...page,
      totalElements: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / page.size)
    })
  }, [sortColumn, sortAsc, filters, initialOrders, page.size])

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortAsc(!sortAsc)
    } else {
      setSortColumn(column)
      setSortAsc(true)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage({ ...page, pageNumber: newPage })
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const totalPages = page.totalPages
    const currentPage = page.pageNumber

    // Always show first page
    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    )

    // Add ellipsis if there are more than 7 pages and we're not in the first 3 pages
    if (totalPages > 7 && currentPage > 3) {
      pageNumbers.push(<span key="ellipsis1">...</span>)
    }

    // Show 2 pages before and after the current page
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      )
    }

    // Add ellipsis if there are more than 7 pages and we're not in the last 3 pages
    if (totalPages > 7 && currentPage < totalPages - 2) {
      pageNumbers.push(<span key="ellipsis2">...</span>)
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }

    return pageNumbers
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => handleSort('orderId')}>
                  Order ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Order ID"
                      value={filters.orderId}
                      onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => handleSort('type')}>
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Import">Import</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => handleSort('date')}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">
                <Button variant="ghost" onClick={() => handleSort('totalPrice')}>
                  Total Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Total Price"
                      value={filters.totalPrice}
                      onChange={(e) => setFilters({ ...filters, totalPrice: e.target.value })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">
                <Button variant="ghost" onClick={() => handleSort('orderDetailsCount')}>
                  Details Count
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Details Count"
                      value={filters.orderDetailsCount}
                      onChange={(e) => setFilters({ ...filters, orderDetailsCount: e.target.value })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">
                <Button variant="ghost" onClick={() => handleSort('totalQuantity')}>
                  Total Quantity
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Total Quantity"
                      value={filters.totalQuantity}
                      onChange={(e) => setFilters({ ...filters, totalQuantity: e.target.value })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No data available</TableCell>
            </TableRow>
          ) : (
            orders.slice((page.pageNumber - 1) * page.size, page.pageNumber * page.size).map((order) => (
              <TableRow key={order.orderId} className="hover:bg-muted/50">
                <TableCell className="font-medium">{order.orderId.slice(0, 8)}...</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{format(new Date(order.date), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                <TableCell className="text-right">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">{order.orderDetailsCount}</TableCell>
                <TableCell className="text-right">{order.totalQuantity}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page.pageNumber} of {page.totalPages}, Total {page.totalElements} records
        </p>
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page.pageNumber - 1)}
            disabled={page.pageNumber === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {renderPageNumbers()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page.pageNumber + 1)}
            disabled={page.pageNumber === page.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}