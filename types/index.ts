import { z } from 'zod'

import { loginSchema } from '../config/zod-schema'

export type Navbar = {
  name: string
  href: string
}

export type LoginFormData = z.infer<typeof loginSchema>