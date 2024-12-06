import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

const fetchSafeStock = async ({ id }: { id: number }) => {
  const params = new URLSearchParams({
    id: String(id)
  })

  const response = await fetch(`${API_ENDPOINTS.GET_SAFE_STOCK}?${params}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch safe stock')
  }

  const data = await response.json()
  return data
}

export const useGetSafeStock = (id: number) => {
  return useSuspenseQuery({
    queryKey: ['safe-stock', id],
    queryFn: () => fetchSafeStock({ id }),
    refetchOnWindowFocus: false
  })
}