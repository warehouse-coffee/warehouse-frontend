import React from 'react'

export type Navbar = {
  name: string
  href: string
}

export type DashboardSidebarItems = {
  name: string
  href: string
  icon: React.ElementType
  requiredRoles: string[]
}