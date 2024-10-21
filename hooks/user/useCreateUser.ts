import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { CreateUser } from '@/types'

const createNewUser = async (data: CreateUser) => {
  const response = await fetch(API_ENDPOINTS.CREATE_USER, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create user')
  }
  return response.json()
}

export const useCreateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}