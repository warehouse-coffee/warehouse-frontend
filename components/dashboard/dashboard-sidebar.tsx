import { Home, Settings, Users, Coffee, Boxes } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/dashboard/products', icon: Boxes },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
]

export default function DashboardSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  return (
    <div className={cn(
      'flex flex-col h-full bg-black dark:bg-background border-r border-r-[#616161] dark:border-r-[#202020] transition-all duration-250',
      open ? 'w-64' : 'w-16'
    )}>
      <div className={cn(
        'flex items-center h-[4.8rem] border-b border-b-[#616161] dark:border-b-[#202020]',
        open ? 'px-4 justify-start' : 'justify-center'
      )}>
        <Coffee className={cn('text-white dark:text-primary h-7 w-7', open ? 'ml-0' : 'ml-[.13rem]')} />
        {open && (
          <h2 className="ml-3 text-[1.5rem] font-bold uppercase text-white dark:text-white overflow-hidden whitespace-nowrap">Coffee TD.</h2>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className={cn('py-4 mt-[.5rem]', open ? 'px-4' : 'px-2')}>
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full flex items-center h-[2.85rem] mb-2 text-white font-normal hover:text-black dark:text-white dark:hover:bg-primary/10 dark:hover:text-primary transition-all duration-250',
                  open ? 'justify-start px-4' : 'justify-center px-0',
                  pathname === item.href && 'text-black dark:bg-primary/10 dark:text-primary'
                )}
              >
                <item.icon className={cn('flex-shrink-0 h-[1.35rem] w-[1.35rem]')} />
                {open && <span className="text-[1rem] ml-3 overflow-hidden whitespace-nowrap">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}