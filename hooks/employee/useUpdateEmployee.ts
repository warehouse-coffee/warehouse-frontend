import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { UpdateEmployeeCommand } from '@/app/api/web-api-client'
import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const updateEmployee = async (data: UpdateEmployeeCommand) => {
  if (!data?.id) {
    throw new Error('Invalid employee id')
  }
  const response = await fetch(API_ENDPOINTS.UPDATE_EMPLOYEE, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update employee')
  }
  return response.json()
}

export const useUpdateEmployee = (onComplete: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee updated successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}