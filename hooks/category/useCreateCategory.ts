import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const createCategory = async (data: { name: string }) => {
  const formattedData = {
    category: {
      name: data.name
    }
  }

  const response = await fetch(API_ENDPOINTS.CREATE_CATEGORY, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formattedData)
  })

  const result = await response.json()

  if (result.statusCode === 400) {
    throw new Error(result.message)
  }

  if (!response.ok) {
    throw new Error('Failed to create category')
  }

  return result
}

export const useCreateCategory = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(data.message || 'Category created successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}