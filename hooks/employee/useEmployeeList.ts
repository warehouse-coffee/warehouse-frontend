import { useSuspenseQuery } from '@tanstack/react-query'

import { EmployeeListVM } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { stringify } from 'querystring'

interface FetchEmployeesParams {
  pageIndex: number
  pageSize: number
}

const fetchEmployees = async ({ pageIndex, pageSize }: FetchEmployeesParams): Promise<EmployeeListVM> => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex).toString(),
    size: pageSize.toString()
  })
  const response = await fetch(`${API_ENDPOINTS.GET_ALL_EMPLOYEES}?${params}`, {
    method: METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
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

export const useEmployeeList = (page: number, pageSize: number) => {
  return useSuspenseQuery({
    queryKey: ['employees', page, pageSize],
    queryFn: () => fetchEmployees({ pageIndex: page, pageSize })
  })
}