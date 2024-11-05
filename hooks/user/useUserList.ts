import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'
import { User } from '@/types'

interface FetchUsersParams {
  pageIndex: number
  pageSize: number
  // searchText?: string
}

const fetchUsers = async ({ pageIndex, pageSize }: FetchUsersParams): Promise<{ users: User[], page: Page }> => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })

  // if (searchText) {
  //   params.append('searchText', searchText.trim())
  // }

  const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}?${params}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  // if (searchText && (!data.users || data.users.length === 0)) {
  //   return {
  //     users: [],
  //     page: {
  //       ...data.page,
  //       totalElements: 0
  //     }
  //   }
  // }

  if (!data.users) {
    throw new Error('Invalid response format')
  }

  return data
}

export const useUserList = (pageIndex: number, pageSize: number, searchText?: string) => {
  return useSuspenseQuery({
    queryKey: ['users', pageIndex, pageSize, searchText],
    queryFn: () => fetchUsers({ pageIndex, pageSize }),
    // staleTime: 1000 * 60 * 5,
    // retry: 1,
    refetchOnWindowFocus: false
  })
}