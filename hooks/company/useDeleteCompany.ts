import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { API_ENDPOINTS, METHODS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const deleteCompany = async (companyId: string) => {
  const response = await fetch(`${API_ENDPOINTS.DELETE_COMPANY}?companyId=${companyId}`, {
    method: METHODS.DELETE
  })

  console.log(response)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete company')
  }

  const data = response.json()

  return data
}

export const useDeleteCompany = (onComplete?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies']
      })

      toast.success('Company deleted successfully')
    },
    onError: (error: Error) => {
      handleApiError(error)
      toast.error(error.message)
    },
    onSettled: () => {
      onComplete?.()
    }
  })
}