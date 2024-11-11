'use client'

import { Loader } from '@/components/ui/loader'

export default function DashboardLoading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center flex-col justify-center gap-4">
      <Loader color="#62c5ff" size="3.55rem" />
      <span className="text-[1rem] text-black dark:text-muted">Loading data...</span>
    </div>
  )
}