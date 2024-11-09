import { PanelRight, PanelLeftClose, Bell, LogOut, User, Settings } from 'lucide-react'
import React from 'react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

interface DashboardHeaderProps {
  toggleSidebar: () => void
  sidebarOpen: boolean
  onLogout: () => Promise<void>
}

export default function DashboardHeader({ toggleSidebar, sidebarOpen, onLogout }: DashboardHeaderProps) {
  const { userInfo } = useAuth()

  return (
    <header className="flex items-center justify-between p-4 border-b dark:border-b-[#202020] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className='rounded-full hover:bg-[#dbdbdb7a] dark:hover:bg-[#272727] cursor-pointer' onClick={toggleSidebar}>
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5 text-black dark:text-white" /> : <PanelRight className="h-5 w-5 text-black dark:text-white" />}
        </Button>
        <Input
          type="search"
          placeholder="Search..."
          className="md:w-[300px] lg:w-[400px]"
        />
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle storageKey="dashboard-theme" />
        <Button variant="ghost" size="icon" className='hover:bg-transparent cursor-pointer'>
          <Bell className="h-5 w-5 text-black dark:text-white" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userInfo?.avatar} alt={userInfo?.username} />
                <AvatarFallback>{userInfo?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-white p-2 dark:bg-[#141414] text-black dark:text-white border border-gray-200 dark:border-[#272727] shadow-lg rounded-md" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium leading-none">{userInfo?.username}</p>
                <p className="text-xs leading-none text-gray-500 dark:text-[#8a8a8a]">
                  {userInfo?.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
            <DropdownMenuItem className="px-2 h-9 text-black hover:text-black dark:text-white hover:bg-gray-500/10 dark:hover:bg-[#272727] cursor-pointer mb-2 [&>*]:text-black [&>*]:dark:text-white [&>*]:hover:text-black [&>*]:dark:hover:text-white">
              <User className="mr-2 h-4 w-4" />
              <span className='text-[.85rem]'>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="px-2 h-9 text-black hover:text-black dark:text-white hover:bg-gray-500/10 dark:hover:bg-[#272727] cursor-pointer mb-2 [&>*]:text-black [&>*]:dark:text-white [&>*]:hover:text-black [&>*]:dark:hover:text-white">
              <Settings className="mr-2 h-4 w-4" />
              <span className='text-[.85rem]'>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727] mb-2" />
            <DropdownMenuItem className="px-2 h-9 text-[#ff0000] hover:text-[#ff0000] dark:text-[#ff1717] hover:font-bold hover:bg-red-500/10 dark:hover:bg-red-900/30 cursor-pointer transition-all duration-250 [&>*]:text-[#ff0000] [&>*]:dark:text-[#ff1717] [&>*]:hover:text-[#ff0000] [&>*]:dark:hover:text-[#ff1717]" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className='text-[.85rem]'>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}