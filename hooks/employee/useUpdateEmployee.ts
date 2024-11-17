import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'

import {API_ENDPOINTS, METHODS} from '@/constants'
import {handleApiError} from '@/lib/utils'
import {UpdateEmployee} from '@/types'

const updateEmployee = async (data: UpdateEmployee) => {
    if (!data?.id) {
        throw new Error('Invalid employee id')
    }
  const response = await fetch(`${API_ENDPOINTS.UPDATE_EMPLOYEE}?id=${data.id}`, {
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
      queryClient.invalidateQueries({queryKey: ['employees']})
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
