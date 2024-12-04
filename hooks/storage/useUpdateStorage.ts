import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { UpdateStorageCommand } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const updateStorage = async (data: UpdateStorageCommand) => {
  if (!data?.storageId) {
    throw new Error('Invalid storage id')
  }
  const response = await fetch(API_ENDPOINTS.UPDATE_STORAGE, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update storage')
  }
  return response.json()
}

export const useUpdateStorage = (onComplete: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStorage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storages'] })
      toast.success('Storage updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}