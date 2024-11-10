"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Filter,
  MoreHorizontal,
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmployeesData from "./employees-data";
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
  getSortedRowModel
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { useEmployeeList } from "@/hooks/employee/useEmployeeList";
import { Employee } from "@/types";

type SortDirection = "asc" | "desc" | null;
type SortField = "userName" | "email" | "phoneNumber" | "isActived" | null;

export default function EmployeesTable() {
  const { reset } = useQueryErrorResetBoundary()
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const pageInfo = { size: 5, pageNumber: 1, totalElements: 0, totalPages: 5 };
  const [currentPage, setCurrentPage] = useState(pageInfo.pageNumber);

  const sortEmployees = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }
  const [data, setData] = useState<Employee[]>([])
  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    // {
    //   accessorKey: 'userName',
    //   header: 'Username',
    //   filterFn: fuzzyFilter
    // },
    {
      accessorKey: 'email',
      header: 'Email',
      filterFn: fuzzyFilter
    },
    // {
    //   accessorKey: 'isActived',
    //   header: 'Status',
    //   filterFn: fuzzyFilter
    // },
    // {
    //   accessorKey: 'roleName',
    //   header: 'Role',
    //   filterFn: fuzzyFilter
    // }
  ], [])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })
  const [totalElements, setTotalElements] = useState<number>(0)
  const { data: employeeData } = useEmployeeList(
    pagination.pageIndex,
    pagination.pageSize
  )
  useEffect(() => {
    if (employeeData?.employee) {
      setData(employeeData.employee)
      setTotalElements(employeeData.page?.totalElements ?? 0)
    }
  }, [employeeData])
  const table = useReactTable({
    data,
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
      fuzzy: fuzzyFilter
    },
    manualPagination: true,
    pageCount: Math.ceil(totalElements / pagination.pageSize)
  })
  const initialEmployees: Employee[] = [
    {
      id: "1",
      userName: "Customer@ute.com",
      email: "customer@ute.com",
      phoneNumber: null,
      isActived: false,
      avatarImage: null,
    },
    {
      id: "2",
      userName: "JohnDoe",
      email: "john.doe@ute.com",
      phoneNumber: "0123456789",
      isActived: true,
      avatarImage: null,
    },
    {
      id: "3",
      userName: "JaneSmith",
      email: "jane.smith@ute.com",
      phoneNumber: "0987654321",
      isActived: true,
      avatarImage: null,
    },
    {
      id: "4",
      userName: "BobJohnson",
      email: "bob.johnson@ute.com",
      phoneNumber: "0369852147",
      isActived: false,
      avatarImage: null,
    },
    {
      id: "5",
      userName: "AliceWilliams",
      email: "alice.williams@ute.com",
      phoneNumber: null,
      isActived: true,
      avatarImage: null,
    },
  ];
  const [employees, setEmployees] = useState(initialEmployees);
  const filterEmployees = () => {
    return employees.filter((employee) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === "") return true;
        if (key === "isActived") {
          return (
            employee[key] !== undefined && employee[key].toString() === value
          );
        }
        return employee[key as keyof Employee]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  };
  const filteredAndSortedEmployees = filterEmployees().sort((a, b) => {
    if (sortField) {
      if (
        sortField &&
        a[sortField] != null &&
        b[sortField] != null &&
        a[sortField] < b[sortField]
      )
        return sortDirection === "asc" ? -1 : 1;
      if (
        sortField &&
        a[sortField] != null &&
        b[sortField] != null &&
        a[sortField] > b[sortField]
      )
        return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(
      startPage + maxVisiblePages - 1,
      pageInfo.totalPages
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  
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
                    {sortField === "userName" &&
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
                        onClick={() =>
                          setFilters({ ...filters, isActived: "" })
                        }
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
              <EmployeesData   
                  data={data}
                  table={table}/>
            </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
       
        <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(pageInfo.size, filteredAndSortedEmployees.length)}{" "}
          of {filteredAndSortedEmployees.length} employees
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.totalPages > 5 && currentPage < pageInfo.totalPages - 2 && (
            <Button variant="outline" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageInfo.totalPages))
            }
            disabled={currentPage === pageInfo.totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(pageInfo.totalPages)}
            disabled={currentPage === pageInfo.totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

