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
import DashboardFetchLoader from "@/components/dashboard/dashboard-fetch-loader";
import StoragesCreatePage from "./storages-create";
import { useDialog } from "@/hooks/useDialog";

export default function StoragesPage(){
      const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
        add: false
      })
    return (
        <> <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Storages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[.3rem]">
            <h1 className="text-[1.5rem] font-bold">Storages Management</h1>
            <p className="text-[.85rem] text-muted-foreground">
              Manage Storages effectively here.
            </p>
          </div>
          <button onClick={() => setDialogsOpen(prev => ({ ...prev, add: true }))} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create
          </button>
        </div>
      </div>
      
      <Dialog open={dialogsOpen.add ?? false} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
        <DialogTrigger asChild>
          <button className="hidden"></button>
        </DialogTrigger>
        <DialogContent  className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg"> 
        <DialogHeader>
            <DialogTitle> <h1 className="text-3xl font-bold mb-2 text-gray-800">Create New Storage</h1>
          </DialogTitle>
            <DialogDescription>
            <p className="text-gray-600 mb-6">Fill in the details to create a new storage entry.</p>
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<DashboardFetchLoader />}>
            <StoragesCreatePage onClose={() => closeDialog('add')}/>
          </Suspense>
        </DialogContent>
      </Dialog>
      </>
    )
}