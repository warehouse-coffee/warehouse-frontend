import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS } from '@/constants'
import { handleApiError } from '@/lib/utils'

interface ActivateEmployeeParams {
  id: string
  active: boolean
}

const activateEmployee = async ({ id, active }: ActivateEmployeeParams) => {
  const response = await fetch(API_ENDPOINTS.ACTIVATE_EMPLOYEE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, active })
  })

  if (!response.ok) {
    throw new Error('Failed to update employee status')
  }

  const responseData = await response.json()
  if (responseData.statusCode !== 200) {
    throw new Error(responseData.message)
  }

  return responseData.data
}

export const useActiveEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateEmployee,
    onSuccess: (_: unknown, variables: ActivateEmployeeParams) => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
        refetchType: 'all'
      })
      toast.success(
        `Employee ${variables.active ? 'activated' : 'deactivated'} successfully`
      )
    },
    onError: (error: Error) => {
      handleApiError(error)
    }
  })
}
