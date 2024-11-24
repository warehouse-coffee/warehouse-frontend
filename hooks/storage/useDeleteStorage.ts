import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const deleteStorage = async (id: string) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_STORAGE}?id=${id}`, {
    method: METHODS.DELETE
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete user')
  }
  return response.json()
}

export const useDeleteStorage = (onComplete?: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteStorage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
      toast.error(error.message)
    },
    onSettled: () => {
      onComplete?.()
    }
  })
}