import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const fetchCustomerList = async () => {
  const response = await fetch(`${API_ENDPOINTS.GET_CUSTOMER_LIST}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch customer list')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }
  return data.customers
}

export const useGetCustomerList = () => {
  return useSuspenseQuery({
    queryKey: ['customer-list'],
    queryFn: fetchCustomerList,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false
  })
}