import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/endpoint'

interface FetchLogsParams {
  pageIndex: number
  pageSize: number
}

const fetchLogs = async ({ pageIndex, pageSize }: FetchLogsParams) => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })

  const response = await fetch(`${API_ENDPOINTS.GET_ALL_LOGS}?${params}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  return data
}

export const useLogList = (pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['logs', pageIndex, pageSize],
    queryFn: () => fetchLogs({ pageIndex, pageSize }),
    refetchOnWindowFocus: false
  })
}