import { ROLE_NAMES } from '@/constants'

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES]

export type User = {
  id?: string | undefined;
  companyId?: string | undefined;
  userName?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  roleName?: RoleName | undefined;
  isActived?: boolean;
  avatarImage?: string | undefined;
  storages?: Storage[] | undefined;
}

export type UserDetail = (User & {
  name: string
  phone: string
  companyId: string
  companyPhone: string
  companyEmail: string
  companyName: string
  companyAddress: string
  storages: Storage[]
}) | null
