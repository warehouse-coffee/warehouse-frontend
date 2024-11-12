import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Settings } from '@/types'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const createSetting = async (settings: Settings) => {
  const response = await fetch(API_ENDPOINTS.CREATE_CONFIG, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  })
  if (!response.ok) {
    throw new Error('Failed to create config')
  }
  return response.json()
}

export function useCreateSetting(onComplete?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      toast.success('Config created successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete?.()
    }
  })
}