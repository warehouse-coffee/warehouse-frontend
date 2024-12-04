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
      } else if (key === 'avatarImage') {
        if (value instanceof File) {
          formData.append(key, value, value.name)
        } else if (typeof value === 'string') {
          formData.append(key, value)
        }
      } else if (key === 'password') {
        formData.append(key, value?.toString() || '')
      } else {
        formData.append(key, value.toString())
      }
    }
  })

  const response = await fetch(`${API_ENDPOINTS.UPDATE_USER}?id=${data.id}`, {
    method: METHODS.PUT,
    body: formData
  })

  const responseText = await response.text()

  let result
  try {
    result = typeof responseText === 'string' ? JSON.parse(responseText) : responseText
  } catch (error) {
    console.error('Error parsing response:', error)
    throw new Error('Failed to parse response')
  }

  if (!response.ok) {
    console.error('Update failed:', result)
    throw new Error(result.message || 'Failed to update user')
  }

  return result
}

export const useUpdateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      const parsedResponse = typeof data === 'string' ? JSON.parse(data) : data

      queryClient.invalidateQueries({
        queryKey: ['users']
      })

      toast.success(parsedResponse.message || 'User updated successfully')
    },
    onError: (error) => {
      console.error('Update error:', error)
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}