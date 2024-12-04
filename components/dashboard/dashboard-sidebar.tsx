import { motion, AnimatePresence } from 'framer-motion'
import { Home, Settings, Users, Coffee, Boxes, Logs, Warehouse, Truck, File, ChevronRight, Building } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { DashboardSidebarItems } from '@/types'

const sidebarItems: DashboardSidebarItems[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, requiredRoles: ['Super-Admin', 'Admin', 'Employee'] },
  { name: 'Storages', href: '/dashboard/storages', icon: Warehouse, requiredRoles: ['Admin'] },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Warehouse, requiredRoles: ['Employee'] },
  { name: 'Products', href: '/dashboard/products', icon: Boxes, requiredRoles: ['Employee'] },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: Truck,
    requiredRoles: ['Employee'],
    subItems: [
      { name: 'Sale Orders', href: '/dashboard/orders/sale' },
      { name: 'Import Orders', href: '/dashboard/orders/import' }
    ]
  },
  { name: 'Employees', href: '/dashboard/employees', icon: Users, requiredRoles: ['Admin'] },
  { name: 'Reports', href: '/dashboard/reports', icon: File, requiredRoles: ['Admin'] },
  { name: 'Company Settings', href: '/dashboard/company-settings', icon: Settings, requiredRoles: ['Admin'] },
  { name: 'Users', href: '/dashboard/users', icon: Users, requiredRoles: ['Super-Admin'] },
  { name: 'Companies', href: '/dashboard/companies', icon: Building, requiredRoles: ['Super-Admin'] },
  { name: 'Logs', href: '/dashboard/logs', icon: Logs, requiredRoles: ['Super-Admin'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, requiredRoles: ['Super-Admin'] }
]

export default function DashboardSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()
  const { userInfo } = useAuth()
  const [openItems, setOpenItems] = useState<string[]>([])

  const visibleItems = sidebarItems.filter(item =>
    item.requiredRoles.includes(userInfo?.role as string)
  )

  const toggleSubItems = (itemName: string) => {
    setOpenItems((prev: string[]) =>
      prev.includes(itemName)
        ? prev.filter((item: string) => item !== itemName)
        : [...prev, itemName]
    )
  }

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
          {visibleItems.map((item) => (
            <div key={item.href}>
              {item.subItems ? (
                <Collapsible
                  open={openItems.includes(item.name)}
                  onOpenChange={() => toggleSubItems(item.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full flex items-center h-[2.85rem] mb-2 text-white font-normal hover:text-black dark:text-white dark:hover:bg-primary/10 dark:hover:text-primary transition-all duration-250',
                        open ? 'justify-between px-4' : 'justify-center px-0',
                        pathname.startsWith(item.href) && 'text-black dark:bg-primary/10 dark:text-primary'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn('flex-shrink-0 h-[1.35rem] w-[1.35rem]')} />
                        {open && <span className="text-[1rem] ml-3 overflow-hidden whitespace-nowrap">{item.name}</span>}
                      </div>
                      {open && (
                        <motion.div
                          initial={false}
                          animate={{ rotate: openItems.includes(item.name) ? 270 : -270 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className={cn(!open && 'hidden')}>
                    <AnimatePresence mode="wait">
                      {openItems.includes(item.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                              height: { duration: 0.2, ease: 'easeInOut' },
                              opacity: { duration: 0.2, ease: 'easeInOut' }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {item.subItems.map((subItem) => (
                              <motion.div
                                key={subItem.href}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{
                                  y: 0,
                                  opacity: 1,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <Link href={subItem.href}>
                                  <Button
                                    variant={pathname === subItem.href ? 'secondary' : 'ghost'}
                                    className={cn(
                                      'w-full flex justify-start h-[2.85rem] mb-2 text-white font-normal hover:text-black dark:text-white dark:hover:bg-primary/10 dark:hover:text-primary transition-all duration-250',
                                      'pl-11',
                                      pathname === subItem.href && 'text-black dark:bg-primary/10 dark:text-primary'
                                    )}
                                  >
                                    <span className="text-[1rem] overflow-hidden whitespace-nowrap">{subItem.name}</span>
                                  </Button>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.href}>
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
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}