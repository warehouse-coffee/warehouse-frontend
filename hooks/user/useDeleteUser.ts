import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const deleteUser = async (id: string) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_USER}?id=${id}`, {
    method: METHODS.DELETE
  })
  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
  return response.json()
}

export const useDeleteUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}
