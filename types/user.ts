import { ROLE_NAMES } from '@/constants'

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES]

export interface User {
  id: string
  userName: string
  email: string
  phoneNumber: string
  companyId: string
  roleName: RoleName
  isActived: boolean
  avatarImage: File | string | null
}

export interface UserDetail extends User {
  name: string
  phone: string
  companyPhone: string
  companyEmail: string
  companyName: string
  companyAddress: string
  storages: Storage[]
}
