import { rankItem } from '@tanstack/match-sorter-utils'
import { ColumnDef, FilterFn, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import React from 'react'

import { StorageDto2, Page } from '@/app/api/web-api-client'
import DashboardTablePagination from '@/components/dashboard/dashboard-table-pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useUserStorageList } from '@/hooks/storage'

interface StorageTableProps {
  onEdit: (storage : StorageDto2) => void
  onDelete: (storage : StorageDto2) => void
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}
export function StorageTable({ onEdit, onDelete }: StorageTableProps) {
  const [data, setData] = useState<StorageDto2[]>([])
  const [page, setPage] = useState<Page>(new Page())
  const columns = useMemo<ColumnDef<StorageDto2>[]>(() => [], [])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6
  })
  const { data: userStorageList } = useUserStorageList(pagination.pageIndex, pagination.pageSize)
  React.useEffect(() => {
    if (userStorageList) {
      setData(userStorageList.storages ?? [])
      if (userStorageList.page) {
        setPage(userStorageList.page)
      }
    }
  }, [userStorageList])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    manualPagination: true,
    pageCount: page.totalPages
  })
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
            <TableHead className="w-[100px] cursor-pointer">
              ID
              <SortIcon column="id" />
            </TableHead>
            <TableHead className="cursor-pointer">
              Name
              <SortIcon column="name" />
            </TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead className="cursor-pointer">
              Status
              <SortIcon column="status" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((storage) => (
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={() => storage.id !== undefined && onEdit(storage)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => storage.id !== undefined && onDelete(storage)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
                <TableCell className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRow(expandedRow === storage.id ? null : storage.id ?? null)}
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
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => storage.id !== undefined && onEdit(storage)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => storage.id !== undefined && onDelete(storage)}>
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
      <DashboardTablePagination
        itemName="storage"
        table={table}
        totalElements={page.totalElements ?? 0}
        totalPages={page.totalPages ?? 0}
      />
    </div>
  )
}