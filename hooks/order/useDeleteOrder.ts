import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

interface DeleteOrderParams {
  id: string
  type: 'import' | 'sale'
}

const deleteOrder = async ({ id, type }: DeleteOrderParams) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_ORDER}?id=${id}`, {
    method: METHODS.DELETE
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to delete ${type} order`)
  }

  return response.json()
}

export const useDeleteOrder = (type: 'import' | 'sale', onComplete?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteOrder({ id, type }),
    onSuccess: () => {
      if (type === 'import') {
        queryClient.invalidateQueries({
          queryKey: ['importOrders'],
          refetchType: 'all'
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ['saleOrders'],
          refetchType: 'all'
        })
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} order deleted successfully`)
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