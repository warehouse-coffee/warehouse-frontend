import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

interface FetchImportOrderListParams {
  pageIndex: number
  pageSize: number
}

const fetchImportOrderList = async ({ pageIndex, pageSize }: FetchImportOrderListParams) => {
  const params = new URLSearchParams({
    pageNumber: String(pageIndex + 1),
    size: String(pageSize)
  })

  const response = await fetch(`${API_ENDPOINTS.GET_IMPORT_ORDERS}?${params}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch import orders')
  }

  const data = await response.json()
  return data
}

export const useImportOrderList = (pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['importOrders', pageIndex, pageSize],
    queryFn: () => fetchImportOrderList({ pageIndex, pageSize }),
    refetchOnWindowFocus: false,
    retry: 1
  })
}