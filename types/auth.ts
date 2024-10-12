import { z } from 'zod'

import { loginSchema } from '@/configs/zod-schema'

export type LoginFormData = z.infer<typeof loginSchema>