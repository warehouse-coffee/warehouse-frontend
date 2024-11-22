import { useSuspenseQuery } from '@tanstack/react-query'

import { ListISorageInfoOfUserVM } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'

const fetchStorageOfUserDetail = async (): Promise<ListISorageInfoOfUserVM> => {
  const response = await fetch(`${API_ENDPOINTS.GET_STORAGE_OF_USER_DETAIL}`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user storage list')
  }
  const data = await response.json()
  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }
  return data
}

export const useStorageOfUserDetail = () => {
  return useSuspenseQuery({
    queryKey: ['storageOfUserDetail'],
    queryFn: fetchStorageOfUserDetail,
    refetchOnWindowFocus: false
  })
}
