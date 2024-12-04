import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

interface FetchSaleOrderListParams {
  pageIndex: number
  pageSize: number
}

const fetchSaleOrderList = async ({ pageIndex, pageSize }: FetchSaleOrderListParams) => {
  const params = new URLSearchParams({
    pageNumber: String(pageIndex + 1),
    size: String(pageSize)
  })

  const response = await fetch(`${API_ENDPOINTS.GET_SALE_ORDERS}?${params}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch sale orders')
  }

  const data = await response.json()
  return data
}

export const useGetSaleOrderList = (pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['saleOrders', pageIndex, pageSize],
    queryFn: () => fetchSaleOrderList({ pageIndex, pageSize }),
    refetchOnWindowFocus: false,
    retry: 1
  })
}