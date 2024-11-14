import { ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { ROLE_NAMES } from '@/constants'
import { RoleName } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleApiError = (error: any) => {
  if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('An unknown error occurred')
  }
}

export const formatLabel = (key: string): string => {
  const labels: Record<string, string> = {
    id: 'User ID',
    companyId: 'Company ID',
    isActived: 'Is Active'
  }

  if (key in labels) return labels[key]

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2')
}

export const formatRoleLabel = (role: string) => {
  return role.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

export const getAvailableRoles = () => {
  const { SUPER_ADMIN, ...otherRoles } = ROLE_NAMES
  return Object.values(otherRoles)
}
