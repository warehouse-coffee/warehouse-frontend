import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { CreateImportOrder } from '@/types'

const createImportOrder = async (data: CreateImportOrder) => {
  const response = await fetch(API_ENDPOINTS.CREATE_IMPORT_ORDER, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (result.statusCode === 400) {
    throw new Error(result.message)
  }

  if (!response.ok) {
    throw new Error('Failed to create import order')
  }

  return result
}

export const useCreateImportOrder = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createImportOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['importOrders'], refetchType: 'all' })
      toast.success(data.message || 'Import order created successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}