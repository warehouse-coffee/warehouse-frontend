import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'
import { Employee } from '@/types'

interface FetchEmployeesParams {
  pageIndex: number
  pageSize: number
}

const fetchEmployees = async ({ pageIndex, pageSize }: FetchEmployeesParams): Promise<{ employee: Employee[], page: Page }> => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })
  const response = await fetch(`${API_ENDPOINTS.GET_ALL_EMPLOYEES}?${params}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch employee')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }


  return data
}

export const useEmployeeList = (pageIndex: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['employees', pageIndex, pageSize],
    queryFn: () => fetchEmployees({ pageIndex, pageSize }),
    // staleTime: 1000 * 60 * 5,
    // retry: 1,
    refetchOnWindowFocus: false
  })
}