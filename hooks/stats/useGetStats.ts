import { useSuspenseQuery } from '@tanstack/react-query'

import { ROLE_NAMES } from '@/constants'
import { API_ENDPOINTS } from '@/constants/endpoint'

export interface Prediction {
  aI_predict: number
  accuracy: number
  date: string
}

interface SuperAdminStats {
  totalUser: number
  totalCompany: number
  cpu: number
  ram: number
  prediction: Prediction
}

interface AdminStats {
  totalInventoryValue: number
  onlineEmployeeCount: number
  orderCompletionRate: number
  highDemandItemName: string
  highDemandItemCount: number
  prediction: Prediction
}

interface EmployeeStats {
  outboundInventoryCompletePerMonth: number
  productExpirationCount: number
  totalProductImportPerMonth: number
  totalProductExportPerMonth: number
}

type StatsData = SuperAdminStats | AdminStats | EmployeeStats

const fetchStats = async (role: string | null): Promise<StatsData> => {
  if (!role) throw new Error('Role is required')

  const endpoint =
    role === ROLE_NAMES.SUPER_ADMIN
      ? API_ENDPOINTS.GET_ALL_SUPER_ADMIN_STATS
      : role === ROLE_NAMES.ADMIN
        ? API_ENDPOINTS.GET_ALL_ADMIN_STATS
        : API_ENDPOINTS.GET_ALL_EMPLOYEE_STATS

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
  const requiredKeys: (keyof SuperAdminStats)[] = [
    'totalUser',
    'totalCompany',
    'cpu',
    'ram',
    'prediction'
  ]
  return requiredKeys.every(key => key in stats)
}

export const isAdminStats = (stats: StatsData): stats is AdminStats => {
  const requiredKeys: (keyof AdminStats)[] = [
    'totalInventoryValue',
    'onlineEmployeeCount',
    'orderCompletionRate',
    'highDemandItemName',
    'highDemandItemCount',
    'prediction'
  ]
  return requiredKeys.every(key => key in stats)
}

export const isEmployeeStats = (stats: StatsData): stats is EmployeeStats => {
  const requiredKeys: (keyof EmployeeStats)[] = [
    'outboundInventoryCompletePerMonth',
    'productExpirationCount',
    'totalProductImportPerMonth',
    'totalProductExportPerMonth'
  ]
  return requiredKeys.every(key => key in stats)
}