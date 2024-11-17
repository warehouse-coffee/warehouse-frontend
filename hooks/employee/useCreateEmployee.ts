import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'

import {API_ENDPOINTS, METHODS} from '@/constants'
import {handleApiError} from '@/lib/utils'
import {CreateEmployee} from '@/types'
import { ResponseDto } from '@/app/api/web-api-client'

const createNewEmployee = async (data: CreateEmployee) => {
  const response = await fetch(API_ENDPOINTS.CREATE_EMPLOYEE, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create employee')
  }
  var responseDto: ResponseDto = await response.json()
  if (responseDto.statusCode !== 200) {
    throw new Error(responseDto.message)
  }
  else {
    return responseDto.data
  }
}

export const useCreateEmployee = (onComplete: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['employees']})
      toast.success('Employee created successfully')
    },
    onError: (error) => {
      handleApiError(error)
    },
    onSettled: () => {
      onComplete()
    }
  })
}