import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'
import { METHODS } from '@/constants/method'

interface FetchProductListParams {
  pageIndex: number
  pageSize: number
  filters?: string[]
}

const fetchProductList = async ({ pageIndex, pageSize, filters }: FetchProductListParams) => {
  const params = new URLSearchParams({
    pageNumber: String(pageIndex + 1),
    size: String(pageSize),
    ...(filters ? { filters: filters.join(',') } : {})
  })

  const response = await fetch(`${API_ENDPOINTS.GET_PRODUCT_LIST}?${params}`, {
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
  return data
}

export const useProductList = (pageIndex: number, pageSize: number, filters?: string[]) => {
  return useSuspenseQuery({
    queryKey: ['product-list', pageIndex, pageSize, filters],
    queryFn: () => fetchProductList({ pageIndex, pageSize, filters }),
    refetchOnWindowFocus: false,
    retry: 1
  })
}