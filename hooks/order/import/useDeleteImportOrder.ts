import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const deleteImportOrder = async (id: string) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_IMPORT_ORDER}?id=${id}`, {
    method: METHODS.DELETE
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete import order')
  }
  return response.json()
}

export const useDeleteImportOrder = (onComplete?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteImportOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importOrders'] })
      toast.success('Import order deleted successfully')
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