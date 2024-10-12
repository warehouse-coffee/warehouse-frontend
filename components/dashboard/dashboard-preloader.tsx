import { Coffee } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function DashboardPreloader() {
  return (
    <div className="flex items-center flex-col gap-[.55rem] justify-center h-screen">
      <Coffee className={cn('text-black dark:text-primary h-12 w-12 animate-bounce')} />
      <p className="text-black dark:text-white font-semibold text-[1rem]">Loading...</p>
    </div>
  )
}