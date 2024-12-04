import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const deleteCategory = async (id: string) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_CATEGORY}?id=${id}`, {
    method: METHODS.DELETE
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to delete category`)
  }

  return response.json()
}

export const useDeleteCategory = (onComplete?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'all'
      })

      toast.success(`Category deleted successfully`)
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