'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'

import { CompanyDto } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface CompanyTableProps {
  companies: CompanyDto[]
  onEdit: (company: CompanyDto) => void
  onDelete: (company: CompanyDto) => void
}

export function CompanyTable({ companies = [], onEdit, onDelete }: CompanyTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  // Ensure companies is an array before filtering
  const companyArray = Array.isArray(companies) ? companies : []

  // Filter companies based on search query
  const filteredCompanies = companyArray.filter((company) =>
    company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const PAGE_SIZE = 6
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search companies..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <div className="text-sm text-muted-foreground">
          Total: {filteredCompanies.length} companies
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company.companyId}>
                <TableCell>{company.companyId}</TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.phoneContact}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(company)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(company)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}