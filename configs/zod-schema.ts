import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().refine((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const specialTestEmails = ['superadmin@ute.com', 'admin@ute.com', 'employee@ute.com']
    return emailRegex.test(email) || specialTestEmails.includes(email)
  }, 'Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export const companyFormSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required').min(2, 'Company ID must be at least 2 characters'),
  companyName: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters'),
  phoneContact: z.string().min(1, 'Phone number is required').min(10, 'Phone number must be at least 10 characters'),
  emailContact: z.string().min(1, 'Email is required').email('Invalid email address')
})

export const settingsFormSchema = z.object({
  aiServiceKey: z.string().min(1, 'AI Service Key is required'),
  emailServiceKey: z.string().min(1, 'Email Service Key is required'),
  aiDriverServer: z.string().min(1, 'AI Driver Server URL is required').url('Must be a valid URL')
})

export const importOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhoneNumber: z.string().min(1, 'Phone number is required'),
  products: z.array(z.object({
    name: z.string().min(1, 'Product name is required'),
    unit: z.string().min(1, 'Unit is required'),
    quantity: z.number().min(1, 'Quantity must be greater than 0'),
    price: z.number().min(0, 'Price must be greater than or equal to 0'),
    note: z.string().optional(),
    expiration: z.object({
      from: z.date(),
      to: z.date()
    }),
    categoryId: z.number().min(1, 'Category is required'),
    areaId: z.number().min(1, 'Area is required'),
    storageId: z.number().min(1, 'Storage is required')
  })).min(1, 'At least one product is required')
})

export const saleOrderSchema = z.object({
  customerId: z.number().min(1, 'Customer is required'),
  dateExported: z.date().min(new Date(), 'Date exported must be in the future'),
  products: z.array(z.object({
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().min(1, 'Quantity must be greater than 0'),
    price: z.number().min(0, 'Price must be greater than or equal to 0'),
    expectedPickupDate: z.object({
      from: z.date(),
      to: z.date()
    })
  })).min(1, 'At least one product is required')
})

export const safeStockSchema = z.object({
  safeStock: z.number()
    .min(0, 'Safe stock must be greater than or equal to 0')
    .max(1000000, 'Safe stock must be less than 1,000,000')
})