import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { CreateUser } from '@/types'

const createNewUser = async (data: CreateUser) => {
  const formattedData = {
    userRegister: { ...data }
  }

  const response = await fetch(API_ENDPOINTS.CREATE_USER, {
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
    throw new Error('Failed to create user')
  }

  return result
}

export const useCreateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' })
      toast.success(data.message || 'User created successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}