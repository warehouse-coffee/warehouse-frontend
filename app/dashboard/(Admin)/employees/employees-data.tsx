"use client";

import { Suspense, useCallback, useState } from "react";
import { Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";
import { useDialog } from "@/hooks/useDialog";
import { Employee, EmployeeDetail } from "@/types";
import {
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import React from "react";

interface EmployeesDataProps {
  data: Employee[];
  table: any;
}
const EmployeeActions = React.memo(
  ({
    employee,
    onView,
    onEdit,
    onDelete,
  }: {
    employee: Employee;
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
  }) => (
    <TableCell className="text-right">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onView(employee)}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
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

interface PageInfo {
  size: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

interface EmployeeTableProps {
  initialEmployees?: Employee[];
  pageInfo: PageInfo;
}
type SortDirection = "asc" | "desc" | null;
type SortField = "userName" | "email" | "phoneNumber" | "isActived" | null;

export default function EmployeesData({ data, table }: EmployeesDataProps) {
  const {
    dialogsOpen,
    itemRef: employeeRef,
    openDialog,
    closeDialog,
    setDialogsOpen,
  } = useDialog<Employee>({
    detail: false,
    edit: false,
    delete: false,
  });

  const deleteEmployeeMutation = useDeleteEmployee(() => {
    closeDialog("delete");
  });

  const handleEditEmployee = useCallback(
    (employee: Employee) => {
      openDialog("edit", employee);
    },
    [openDialog]
  );

  const handleViewEmployee = useCallback(
    (employee: Employee) => {
      openDialog("detail", employee);
    },
    [openDialog]
  );

  const handleDeleteEmployee = useCallback(
    (employee: Employee) => {
      openDialog("delete", employee);
    },
    [openDialog]
  );
  const confirmDeleteEmployee = useCallback(() => {
    if (employeeRef.current) {
      deleteEmployeeMutation.mutate(employeeRef.current.id ?? "");
    }
  }, [deleteEmployeeMutation, employeeRef]);

  if (table.getRowModel().rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={5}
          className="h-24 text-muted-foreground text-center"
        >
          {table.getState().globalFilter ? (
            <div className="flex flex-col items-center gap-1">
              <span>
                No employees found matching &quot;
                <span className="font-medium">
                  {table.getState().globalFilter}
                </span>
                &quot;
              </span>
              <span className="text-sm">
                Try adjusting your search to find what you&apos;re looking for.
              </span>
            </div>
          ) : (
            "No employees available."
          )}
        </TableCell>
      </TableRow>
    );
  }

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
  const pageInfo = { size: 5, pageNumber: 1, totalElements: 0, totalPages: 5 };
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState(initialEmployees);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(pageInfo.pageNumber);

  const getInitials = (userName: string) => {
    return userName
      .split(/[@.]/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Sort employees
  const sortEmployees = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
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
      {table.getRowModel().rows.map((row: Row<Employee>) => (
        <TableRow key={row.original.id}>
          <TableCell className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
            <AvatarFallback>
                {row.original.userName
                  ? getInitials(row.original.userName)
                  : "NA"}
              </AvatarFallback>
            </Avatar>
            {row.original.userName}
          </TableCell>
          <TableCell>{row.original.email}</TableCell>
          <TableCell>{row.original.phoneNumber || "N/A"}</TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                row.original.isActived
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {row.original.isActived ? "Active" : "Inactive"}
            </span>
          </TableCell>
          <TableCell>
            <EmployeeActions
              employee={row.original}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </TableCell>
        </TableRow>
      ))}
      <Dialog
        open={dialogsOpen.delete}
        onOpenChange={(open: any) =>
          setDialogsOpen((prev) => ({ ...prev, delete: open }))
        }
      >
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => closeDialog("delete")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${
                deleteEmployeeMutation.isPending
                  ? "flex items-center gap-3 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={confirmDeleteEmployee}
            >
              {deleteEmployeeMutation.isPending ? (
                <>
                  Deleting...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
