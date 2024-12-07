import type { Metadata } from 'next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import SettingsForm from './settings-form'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function SettingsPage() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-[.5rem]">
        <div className="flex flex-col gap-[.3rem]">
          <h1 className="text-[1.5rem] font-bold">Settings Management</h1>
          <p className="text-[.85rem] text-muted-foreground">
            Configure system settings here.
          </p>
        </div>
      </div>
      <section className="mt-[1.5rem]">
        <SettingsForm />
      </section>
    </>
  )
}