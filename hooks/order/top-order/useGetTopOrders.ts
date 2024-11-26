import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'
import { TopOrderResponse } from '@/types'

const fetchTopOrders = async (): Promise<TopOrderResponse> => {
  const response = await fetch(API_ENDPOINTS.GET_TOP_ORDERS, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch top orders')
  }

  const data = await response.json()

  return data
}

export const useGetTopOrders = () => {
  return useSuspenseQuery({
    queryKey: ['top-orders'],
    queryFn: fetchTopOrders,
    refetchOnWindowFocus: false
  })
}