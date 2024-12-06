import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { UpdateSafeStockCommand } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const updateSafeStock = async (data: UpdateSafeStockCommand) => {
  if (!data?.inventoryId) {
    throw new Error('Invalid inventory id')
  }

  const response = await fetch(API_ENDPOINTS.UPDATE_SAFE_STOCK, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to update safe stock')
  }
  
  const result = await response.json()

  return result
}

export const useUpdateSafeStock = (onComplete: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSafeStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['safe-stock'],
        refetchType: 'all' 
      })
      queryClient.invalidateQueries({
        queryKey: ['inventory-list-by-storage'],
        refetchType: 'all'
      })
      toast.success('Safe stock updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}