import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { User } from '@/types'

interface FetchUsersParams {
  pageIndex: number
  pageSize: number
  searchTerm?: string
  status?: string
}

const fetchUsers = async ({ pageIndex, pageSize, searchTerm, status }: FetchUsersParams): Promise<{ users: User[], page: Page }> => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })

  if (searchTerm) {
    params.append('searchTerm', searchTerm)
  }

  if (status) {
    params.append('status', status)
  }

  const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}?${params}`, {
    method: METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  if (!data.users) {
    throw new Error('Invalid response format')
  }

  return data
}

export const useUserList = (
  pageIndex: number,
  pageSize: number,
  searchTerm?: string,
  status?: string
) => {
  return useSuspenseQuery({
    queryKey: ['users', pageIndex, pageSize, searchTerm, status],
    queryFn: () => fetchUsers({ pageIndex, pageSize, searchTerm, status })
  })
}