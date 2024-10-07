import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().refine((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const specialTestEmails = ['superadmin@ute.com', 'admin@ute.com', 'customer@ute.com']
    return emailRegex.test(email) || specialTestEmails.includes(email)
  }, 'Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})