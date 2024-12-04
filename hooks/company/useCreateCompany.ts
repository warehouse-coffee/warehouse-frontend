import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CreateCompanyCommand } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'
import { handleApiError } from '@/lib/utils'

const createNewCompany = async (command: CreateCompanyCommand) => {
  const response = await fetch(API_ENDPOINTS.CREATE_COMPANY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  })

  if (!response.ok) {
    throw new Error('Failed to create company')
  }

  const responseData = await response.json()
  return responseData
}

export const useCreateCompany = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewCompany,
    onMutate: () => {
      // Disable form submission while mutating
      return { isSubmitting: true }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Company created successfully')
      onComplete()
    },
    onError: (error) => {
      handleApiError(error)
    }
  })
}