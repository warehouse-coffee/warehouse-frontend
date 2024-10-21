export type User = {
  id: string
  companyId: string
  avatarImage: string
  userName: string
  email: string
  phoneNumber: string
  roleName: 'Super-Admin' | 'Admin' | 'Customer'
  isActived: boolean
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
