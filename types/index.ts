import React from 'react'
import { z } from 'zod'

import { loginSchema } from '../configs/zod-schema'

export type Navbar = {
  name: string
  href: string
}

export type DashboardSidebarItems = {
  name: string
  href: string
  icon: React.ElementType,
  requiredRoles: string[]
}

export type LoginFormData = z.infer<typeof loginSchema>