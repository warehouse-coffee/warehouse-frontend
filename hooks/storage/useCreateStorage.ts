import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CreateStorageCommand } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const createNewStorage = async (data: CreateStorageCommand) => {
  const response = await fetch(API_ENDPOINTS.CREATE_STORAGE, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create storage')
  }
  return response.json()
}
export const useCreateStorage = (onComplete: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNewStorage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storages'] })
      toast.success('Storage created successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}