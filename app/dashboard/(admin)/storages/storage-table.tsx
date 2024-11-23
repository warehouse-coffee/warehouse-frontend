'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Storage {
  id: number
  name: string
  address: string | null
  status: string
}

interface PageInfo {
  size: number
  pageNumber: number
  totalElements: number
  totalPages: number
  sortBy: string
  sortAsc: boolean
}

interface StorageTableProps {
  storages: Storage[]
  page: PageInfo
  onSort: (column: string) => void
  onPageChange: (pageNumber: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function StorageTable({ storages, page, onSort, onPageChange, onEdit, onDelete }: StorageTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const SortIcon = ({ column }: { column: string }) => {
    if (page.sortBy !== column) return null
    return page.sortAsc ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] cursor-pointer" onClick={() => onSort('id')}>
              ID
              <SortIcon column="id" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
              Name
              <SortIcon column="name" />
            </TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('status')}>
              Status
              <SortIcon column="status" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storages.map((storage) => (
            <>
              <TableRow key={storage.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{storage.id}</TableCell>
                <TableCell>{storage.name}</TableCell>
                <TableCell className="hidden md:table-cell">{storage.address || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${storage.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {storage.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={() => onEdit(storage.id)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(storage.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
                <TableCell className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRow(expandedRow === storage.id ? null : storage.id)}
                  >
                    {expandedRow === storage.id ? 'Hide' : 'Details'}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === storage.id && (
                <TableRow className="md:hidden">
                  <TableCell colSpan={5}>
                    <div className="py-2">
                      <p><strong>Address:</strong> {storage.address || 'N/A'}</p>
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => onEdit(storage.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(storage.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {page.pageNumber} of {page.totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page.pageNumber - 1)}
            disabled={page.pageNumber === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page.pageNumber + 1)}
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