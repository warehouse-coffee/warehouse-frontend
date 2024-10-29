import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'
import { User } from '@/types'

interface FetchUsersParams {
  pageIndex: number
  pageSize: number
}

const fetchUsers = async ({ pageIndex, pageSize }: FetchUsersParams): Promise<{ users: User[], page: Page }> => {
  const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}?pageNumber=${pageIndex + 1}&size=${pageSize}`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await response.json()
  return data
}

export const useUserList = (pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['users', pageIndex, pageSize],
    queryFn: () => fetchUsers({ pageIndex, pageSize })
  })
}