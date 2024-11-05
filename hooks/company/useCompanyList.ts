import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const fetchCompanies = async () => {
  const response = await fetch(API_ENDPOINTS.GET_ALL_COMPANIES, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data
}

export const useCompanyList = () => {
  return useSuspenseQuery({
    queryKey: ['companies'],
    queryFn: () => fetchCompanies(),
    refetchOnWindowFocus: false
  })
}