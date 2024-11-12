import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().refine((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const specialTestEmails = ['superadmin@ute.com', 'admin@ute.com', 'employee@ute.com']
    return emailRegex.test(email) || specialTestEmails.includes(email)
  }, 'Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const settingsFormSchema = z.object({
  aiServiceKey: z.string().min(1, 'AI Service Key is required'),
  emailServiceKey: z.string().min(1, 'Email Service Key is required'), 
  aiDriverServer: z.string().min(1, 'AI Driver Server URL is required').url('Must be a valid URL')
})