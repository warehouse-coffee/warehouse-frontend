import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { UpdateUser } from '@/types'

const updateUser = async (data: UpdateUser) => {
  const response = await fetch(`${API_ENDPOINTS.UPDATE_USER}?id=${data.id}`, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

export const useUpdateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}