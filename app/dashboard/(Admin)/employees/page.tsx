"use client";

import { Suspense, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import EmployeesCreatePage from "./employees-create";
import EmployeesTable from "./employees-table";
import DashboardFetchLoader from "@/components/dashboard/dashboard-fetch-loader";

export default function UsersPage() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const openDialog = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Employees</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[.3rem]">
            <h1 className="text-[1.5rem] font-bold">Employees Management</h1>
            <p className="text-[.85rem] text-muted-foreground">
              Manage employees and assign their roles effectively here.
            </p>
          </div>
          <button onClick={openDialog}  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create
          </button>
        </div>
      </div>
      <EmployeesTable />
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="hidden"></button>
        </DialogTrigger>
        <DialogContent className="w-[800px] sm:w-[1000px] !max-w-none">
        <DialogHeader>
            <DialogTitle>Create Employee</DialogTitle>
            <DialogDescription>
              View create employee details here.
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<DashboardFetchLoader />}>
            <EmployeesCreatePage/>
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
}
