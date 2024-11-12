import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS, METHODS } from '@/constants'

const getSetting = async () => {
  const response = await fetch(API_ENDPOINTS.GET_CONFIG, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to get settings')
  }
  return response.json()
}

export function useGetSetting() {
  return useSuspenseQuery({
    queryKey: ['settings'],
    queryFn: getSetting
  })
}
