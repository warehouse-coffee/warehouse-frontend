'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function ThemeToggle({ storageKey = 'theme' }: { storageKey?: string }) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className='rounded-full hover:bg-[#dbdbdb7a] dark:hover:bg-[#272727] cursor-pointer'>
          <Sun className="h-[1.2rem] w-[1.2rem] text-black dark:text-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] text-black dark:text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white dark:bg-[#141414] text-black dark:text-white border border-gray-200 dark:border-[#272727] shadow-lg rounded-md' align="end">
        <DropdownMenuItem
          className='text-black hover:text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#272727] cursor-pointer [&>*]:text-black [&>*]:dark:text-white [&>*]:hover:text-black [&>*]:dark:hover:text-white'
          onClick={() => setTheme('light')}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-black hover:text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#272727] cursor-pointer [&>*]:text-black [&>*]:dark:text-white [&>*]:hover:text-black [&>*]:dark:hover:text-white'
          onClick={() => setTheme('dark')}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-black hover:text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#272727] cursor-pointer [&>*]:text-black [&>*]:dark:text-white [&>*]:hover:text-black [&>*]:dark:hover:text-white'
          onClick={() => setTheme('system')}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}