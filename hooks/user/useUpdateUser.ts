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
    throw new Error('Failed to parse response')
  }

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update user')
  }

  return result
}

export const useUpdateUser = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (response) => {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response

      // queryClient.getQueriesData({ queryKey: ['users'] }).forEach(([queryKey, oldData]: [any, any]) => {
      //   if (!oldData) return

      //   queryClient.setQueryData(queryKey, {
      //     ...oldData,
      //     users: oldData.users.map((user: any) =>
      //       user.id === parsedResponse.data.id ? { ...user, ...parsedResponse.data } : user
      //     )
      //   })
      // })

      queryClient.setQueryData(['userDetail', parsedResponse.data.id], (oldData: any) => {
        if (!oldData) return oldData
        return { ...oldData, ...parsedResponse.data }
      })

      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['userDetail', parsedResponse.data.id],
        refetchType: 'all'
      })

      toast.success(parsedResponse.message || 'User updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}