export type User = {
  id: string
  companyId: string
  avatar: string
  userName: string
  email: string
  phoneNumber: string
  roleName: 'Super-Admin' | 'Admin' | 'Customer'
  isActive: boolean
}

export type UpdateUser = User & {
  password: string
}

export type UserDetail = User & {
  userId: string
  name: string
  phone: string
  companyPhone: string
  companyEmail: string
  companyName: string
  companyAddress: string
  storages: Storage[]
  imageFile: string
}
