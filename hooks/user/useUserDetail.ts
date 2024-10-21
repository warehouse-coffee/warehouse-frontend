import { useSuspenseQuery } from '@tanstack/react-query'
import { UserDetail } from '@/types'
import { API_ENDPOINTS } from '@/constants'

const fetchUserDetail = async (id: string): Promise<UserDetail> => {
  const response = await fetch(`${API_ENDPOINTS.GET_USER_DETAIL}?id=${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user details')
  }
  return response.json()
}

export const useUserDetail = (userId: string) => {
  return useSuspenseQuery<UserDetail>({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserDetail(userId)
  })
}