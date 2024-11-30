import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const fetchCategoryList = async () => {
  const response = await fetch(API_ENDPOINTS.GET_CATEGORY_LIST, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch category list')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data.categories
}

export const useGetCategoryList = () => {
  return useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoryList,
    // staleTime: 1000 * 60 * 5,
    // gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false
  })
}