import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'
import { UpdateUser } from '@/types'

const updateUser = async (data: UpdateUser) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'isActived') {
        formData.append(key, value === true ? 'true' : 'false')
      } else if (key === 'password' || key === 'avatarImage') {
        formData.append(key, value?.toString() || '')
      } else {
        formData.append(key, value.toString())
      }
    }
  })

  // console.log('Sending update data:', Object.fromEntries(formData))

  const response = await fetch(`${API_ENDPOINTS.UPDATE_USER}?id=${data.id}`, {
    method: METHODS.PUT,
    body: formData
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update user')
  }

  return result
}

export const useUpdateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(data.message || 'User updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}