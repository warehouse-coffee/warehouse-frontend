import { useSuspenseQuery } from '@tanstack/react-query'

import { ROLE_NAMES } from '@/constants'
import { API_ENDPOINTS } from '@/constants/endpoint'

interface SuperAdminStats {
  totalUser: number
  totalCompany: number
  cpu: number
  ram: number
}

interface AdminStats {
  totalInventoryValue: number
  onlineEmployeeCount: number
  orderCompletionRate: number
  highDemandItemSummary: string | null
}

type StatsData = SuperAdminStats | AdminStats

const fetchStats = async (role: string | null): Promise<StatsData> => {
  if (!role) throw new Error('Role is required')

  const endpoint =
    role === ROLE_NAMES.SUPER_ADMIN
      ? API_ENDPOINTS.GET_ALL_SUPER_ADMIN_STATS
      : API_ENDPOINTS.GET_ALL_ADMIN_STATS

  const response = await fetch(endpoint, {
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

export const useGetStats = (role: string | null) => {
  return useSuspenseQuery({
    queryKey: ['stats', role],
    queryFn: () => fetchStats(role),
    refetchInterval: 5000,
    staleTime: 0
  })
}

export const isSuperAdminStats = (stats: StatsData): stats is SuperAdminStats => {
  const requiredKeys: (keyof SuperAdminStats)[] = ['totalUser', 'totalCompany', 'cpu', 'ram']
  return requiredKeys.every(key => key in stats)
}

export const isAdminStats = (stats: StatsData): stats is AdminStats => {
  const requiredKeys: (keyof AdminStats)[] = ['totalInventoryValue', 'onlineEmployeeCount', 'orderCompletionRate', 'highDemandItemSummary']
  return requiredKeys.every(key => key in stats)
}