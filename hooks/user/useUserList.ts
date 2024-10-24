import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'
import { User } from '@/types'

const fetchUsers = async (): Promise<{ users: User[] }> => {
  const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await response.json()
  return data
}

export const useUserList = () => {
  return useSuspenseQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })
}