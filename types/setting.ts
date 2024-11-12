import { z } from 'zod'

import { settingsFormSchema } from '@/configs/zod-schema'

export type Settings = {
  aiServiceKey: string
  emailServiceKey: string
  aiDriverServer: string
}

export type UpdateSettingsResponse = {
  success: boolean
  message: string
}

export type SettingsFormValues = z.infer<typeof settingsFormSchema>