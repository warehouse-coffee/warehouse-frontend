import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { CreateSaleOrder } from '@/types'

const createSaleOrder = async (data: CreateSaleOrder) => {
  const formattedData = { ...data }

  const response = await fetch(API_ENDPOINTS.CREATE_SALE_ORDER, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formattedData)
  })

  const result = await response.json()

  if (result.error || result.statusCode === 400) {
    throw new Error(result.error || result.message)
  }

  if (!response.ok) {
    throw new Error('Failed to create sale order')
  }

  return result
}

export const useCreateSaleOrder = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSaleOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saleOrders'] })
      toast.success(data.message || 'Sale order created successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}
