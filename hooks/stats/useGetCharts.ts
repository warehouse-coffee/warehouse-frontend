import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

interface CoffeePriceGraph {
  date: string
  ai_predict: number
  real_price_difference_rate: number
}

const fetchCharts = async (): Promise<CoffeePriceGraph[]> => {
  const response = await fetch(API_ENDPOINTS.GET_COFFEE_PRICE_PREDICT_GRAPH, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data.pointInfos
}

export const useGetCharts = () => {
  return useSuspenseQuery({
    queryKey: ['charts'],
    queryFn: fetchCharts,
    refetchInterval: 5000,
    staleTime: 0
  })
}