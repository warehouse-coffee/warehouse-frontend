'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { useAuth } from '@/hooks/useAuth'

import { sidebarItems } from './dashboard/dashboard-sidebar'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { userInfo } = useAuth()

  const visibleItems = sidebarItems.filter(item =>
    item.requiredRoles.includes(userInfo?.role as string)
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const navigationItems = visibleItems.filter(item => !item.subItems)
  const itemsWithSubItems = visibleItems.filter(item => item.subItems)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center w-full md:w-[300px] lg:w-[400px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
      >
        <span className="text-sm text-muted-foreground">Search...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-[1.25rem] select-none items-center gap-1 rounded border bg-muted dark:bg-primary/10 dark:text-primary px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-[.65rem]">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="What are you looking for?" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          {itemsWithSubItems.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Sub Navigation">
                {itemsWithSubItems.map((item) => (
                  item.subItems?.map((subItem) => (
                    <CommandItem
                      key={subItem.href}
                      onSelect={() => runCommand(() => router.push(subItem.href))}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.name}</span>
                    </CommandItem>
                  ))
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}