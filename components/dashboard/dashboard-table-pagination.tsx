import { Table } from '@tanstack/react-table'
import React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'

interface DashboardTablePaginationProps<TData> {
  table: Table<TData>
  totalElements: number
  totalPages: number
  itemName: string
}

export default function DashboardTablePagination<TData>({
  table,
  totalElements,
  totalPages,
  itemName
}: DashboardTablePaginationProps<TData>) {
  const renderPaginationItems = () => {
    const maxVisible = 5
    const currentPage = table.getState().pagination.pageIndex
    const pages = []

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.setPageIndex(i)
              }}
              isActive={i === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      pages.push(
        <PaginationItem key={0}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.setPageIndex(0)
            }}
            isActive={currentPage === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (currentPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-1">
            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
              <PaginationEllipsis />
            </PaginationLink>
          </PaginationItem>
        )
      }

      for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.setPageIndex(i)
              }}
              isActive={i === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (currentPage < totalPages - 3) {
        pages.push(
          <PaginationItem key="ellipsis-2">
            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
              <PaginationEllipsis />
            </PaginationLink>
          </PaginationItem>
        )
      }

      pages.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.setPageIndex(totalPages - 1)
            }}
            isActive={currentPage === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  return (
    <div className="w-full flex items-center justify-between mt-[1.25rem]">
      <p className="text-[.85rem] text-muted-foreground">
        Showing {' '}
        {table.getRowModel().rows.length === 0
          ? 0
          : totalElements === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} {' '}
        to {' '}
        {table.getRowModel().rows.length === 0
          ? 0
          : Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            totalElements
          )}{' '}
        of {totalElements} {itemName}{totalElements !== 1 ? 's' : ''}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.previousPage()
              }}
              aria-disabled={!table.getCanPreviousPage()}
              className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.nextPage()
              }}
              aria-disabled={!table.getCanNextPage()}
              className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}