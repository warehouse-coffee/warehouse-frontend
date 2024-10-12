export type User = {
  id: string
  avatar: string
  username: string
  email: string
  status: 'active' | 'inactive'
  role: 'Admin' | 'Customer'
}