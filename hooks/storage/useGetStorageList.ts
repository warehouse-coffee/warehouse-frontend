import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const fetchStorageList = async () => {
  const response = await fetch(API_ENDPOINTS.GET_STORAGE_LIST, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch storage list')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data.storages
}

export const useGetStorageList = () => {
  return useSuspenseQuery({
    queryKey: ['storages'],
    queryFn: fetchStorageList,
    refetchOnWindowFocus: false
  })
}