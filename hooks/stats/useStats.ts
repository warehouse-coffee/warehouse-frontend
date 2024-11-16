import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

const fetchStats = async () => {
  const response = await fetch(`${API_ENDPOINTS.GET_ALL_STATS}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data
}

export const useStats = () => {
  return useSuspenseQuery({
    queryKey: ['stats'],
    queryFn: () => fetchStats()
  })
}