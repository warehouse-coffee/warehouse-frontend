import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'
import { Employee } from '@/types'

interface FetchEmployeesParams {
  pageIndex: number
  pageSize: number
  // searchText?: string
}

const fetchEmployees = async ({ pageIndex, pageSize }: FetchEmployeesParams): Promise<{ employee: Employee[], page: Page }> => {
  const params = new URLSearchParams({
    pageNumber: (pageIndex + 1).toString(),
    size: pageSize.toString()
  })

  // if (searchText) {
  //   params.append('searchText', searchText.trim())
  // }

  const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}?${params}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch employee')
  }

  const data = await response.json()

  if (!data || data.error) {
    throw new Error(data?.error || 'No data received')
  }

  // if (searchText && (!data.employee || data.employee.length === 0)) {
  //   return {
  //     employee: [],
  //     page: {
  //       ...data.page,
  //       totalElements: 0
  //     }
  //   }
  // }

  
//   if (!data.employees) {
//     throw new Error('Invalid response format')
//   }
  const initialEmployees: Employee[] = [
    {
      id: "1",
      userName: "Customer@ute.com",
      email: "customer@ute.com",
      phoneNumber: null,
      isActived: false,
      avatarImage: null,
    },
    {
      id: "2",
      userName: "JohnDoe",
      email: "john.doe@ute.com",
      phoneNumber: "0123456789",
      isActived: true,
      avatarImage: null,
    },
    {
      id: "3",
      userName: "JaneSmith",
      email: "jane.smith@ute.com",
      phoneNumber: "0987654321",
      isActived: true,
      avatarImage: null,
    },
    {
      id: "4",
      userName: "BobJohnson",
      email: "bob.johnson@ute.com",
      phoneNumber: "0369852147",
      isActived: false,
      avatarImage: null,
    },
    {
      id: "5",
      userName: "AliceWilliams",
      email: "alice.williams@ute.com",
      phoneNumber: null,
      isActived: true,
      avatarImage: null,
    },
  ];
  const empty: Employee[] = []
  const rs = {
    employee: initialEmployees,
    page: {
      totalElements: 5,
      totalPages: 1,
      pageNumber: 1,
      pageSize: 5,
      init: () => {},
      toJSON: () => ({ totalElements: 5, totalPages: 1, pageNumber: 1, pageSize: 5 })
    }
  }
  return rs
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