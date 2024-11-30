import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const fetchProductOrder = async () => {
  const response = await fetch(API_ENDPOINTS.GET_PRODUCT_ORDER, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch product order')
  }
  const data = await response.json()
  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }
  return data.products
}

export const useGetProductOrder = () => {
  return useSuspenseQuery({
    queryKey: ['productsOrder'],
    queryFn: fetchProductOrder,
    // staleTime: 1000 * 60 * 5,
    // retry: 1,
    refetchOnWindowFocus: false
  })
}