"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpDown,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmployeesDataLoading from "./employees-data-loading";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
  FilterFn,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useEmployeeList } from "@/hooks/employee/useEmployeeList";
import { Employee } from "@/types";
import { EmployeeDto, EmployeeListVM, Page } from "@/app/api/web-api-client";
import { useDialog } from "@/hooks/useDialog";
import React from "react";
import dynamic from 'next/dynamic'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

type SortDirection = "asc" | "desc" | null;
type SortField = "userName" | "email" | "phoneNumber" | "isActived" | null;

const EmployeeDataMain = dynamic(() => import('./employees-data'), {
  ssr: false,
  loading: () => <EmployeesDataLoading />
})
const EmployeeActions = React.memo(
  ({
    employee,
    onEdit,
    onDelete,
  }: {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
  }) => (
    <TableCell className="text-right">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEdit(employee)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onDelete(employee)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </TableCell>
  )
);
EmployeeActions.displayName = "EmployeeActions";
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function EmployeesTable() {
  const { reset } = useQueryErrorResetBoundary();

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  //page
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<Page>(new Page({
    size: 2,
    pageNumber: 0,
    totalElements: 0,
    totalPages: 0,
  }));
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize:  2,
  });
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0)

  // Employee list  
  const [data, setData] = useState<EmployeeListVM>();
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const { data: employeeListVM } = useEmployeeList(
    pagination.pageIndex,
    pagination.pageSize
  );
 
  useEffect(() => {
    if (employeeListVM) {
      setData(employeeListVM);
      setEmployees(employeeListVM.employees || []);
      setTotalElements(employeeListVM.page?.totalElements || 0);
      if(employeeListVM.page) {
        setPageInfo(employeeListVM.page);
      }
      setCurrentPage(employeeListVM.page?.pageNumber || 0); 
      setTotalPages(employeeListVM.page?.totalPages || 0);
    }
  }, [employeeListVM]);

  const sortEmployees = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

 
  const columns = useMemo<ColumnDef<EmployeeDto>[]> (() => [
    {
      accessorKey: "userName",
      header: "User Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "isActived",
      header: "Active Status",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          Action
        </Button>
      ),
    },
  ],[]);

  const table = useReactTable({
    data: employees || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalElements / pagination.pageSize),
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees("userName")}
                  className="cursor-pointer"
                >
                  User Name
                  
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[10rem]">
                      <DropdownMenuLabel>
                        Sort by
                      </DropdownMenuLabel>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter User Name"
                      value={filters.userName || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, userName: e.target.value })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees("email")}
                  className="cursor-pointer"
                >
                  Email
                  {sortField === "email" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Email"
                      value={filters.email || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, email: e.target.value })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees("phoneNumber")}
                  className="cursor-pointer"
                >
                  Phone Number
                  {sortField === "phoneNumber" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Input
                      placeholder="Filter Phone Number"
                      value={filters.phoneNumber || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => sortEmployees("isActived")}
                  className="cursor-pointer"
                >
                  Active Status
                  {sortField === "isActived" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="inline-block w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block w-4 h-4" />
                    ))}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setFilters({ ...filters, isActived: "" })}
                    >
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters({ ...filters, isActived: "true" })
                      }
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters({ ...filters, isActived: "false" })
                      }
                    >
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <TableRow>
                <TableCell className="w-full flex flex-col items-center justify-center">
                  There was an error! Please try again.
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
                    onClick={() => resetErrorBoundary()}
                  >
                    Try again
                  </Button>
                </TableCell>
              </TableRow>
            )}
          >
            <Suspense fallback={<EmployeesDataLoading />}>
              <EmployeeDataMain table={table} />
            </Suspense>
          </ErrorBoundary>
        </TableBody>
      </Table>
      <div className="w-full flex items-center justify-between mt-[1.25rem]">
        <p className="text-[.85rem] text-muted-foreground">
           Showing {' '}
          {table.getRowModel().rows.length === 0 ? 0 : totalElements === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1} {' '}
          to {' '}
          {table.getRowModel().rows.length === 0 ? 0 : Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            totalElements
          )} {' '}
          of {totalElements} user{totalElements > 1 ? 's' : ''}
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
            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(i)
                  }}
                  isActive={i === pagination.pageIndex}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
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
    </>
  );
}
