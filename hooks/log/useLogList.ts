import { useSuspenseQuery } from '@tanstack/react-query'

import { API_ENDPOINTS, METHODS } from '@/constants'

interface FetchLogsParams {
  pageIndex: number
  pageSize: number
  date?: Date
}

const fetchLogs = async ({ pageIndex, pageSize, date }: FetchLogsParams) => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })

  if (date) {
    params.append('date', date.toISOString())
  }

  const response = await fetch(`${API_ENDPOINTS.GET_ALL_LOGS}?${params}`, {
    method: METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
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

export const useLogList = (
  pageIndex: number,
  pageSize: number,
  date?: Date
) => {
  return useSuspenseQuery({
    queryKey: ['logs', pageIndex, pageSize, date?.toISOString()],
    queryFn: () => fetchLogs({ pageIndex, pageSize, date }),
    refetchOnWindowFocus: false
  })
}