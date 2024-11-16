import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

interface StatsData {
  totalUser: number
  totalCompany: number
  cpu: number
  ram: number
}

const fetchStats = async (): Promise<StatsData> => {
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

export const useGetStats = () => {
  return useSuspenseQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
    staleTime: 0
  })
}