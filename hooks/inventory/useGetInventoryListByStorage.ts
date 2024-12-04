import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'
import { METHODS } from '@/constants/method'

interface FetchInventoriesByStorageParams {
  storageId: number
  pageIndex: number
  pageSize: number
  filters?: string[]
}

const fetchInventoriesByStorage = async ({ storageId, pageIndex, pageSize }: FetchInventoriesByStorageParams) => {
  const params = new URLSearchParams({
    storageId: String(storageId),
    pageNumber: String(pageIndex + 1),
    size: String(pageSize)
  })

  const response = await fetch(`${API_ENDPOINTS.GET_INVENTORY_LIST_BY_STORAGE}?${params}`, {
    credentials: 'include',
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch inventories by storage')
  }

  const data = await response.json()
  return data.inventories
}

export const useInventoriesByStorage = (storageId: number, pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['inventory-list-by-storage', storageId, pageIndex, pageSize],
    queryFn: () => fetchInventoriesByStorage({ storageId, pageIndex, pageSize }),
    refetchOnWindowFocus: false,
    retry: 1
  })
}