import { useQuery } from '@tanstack/react-query'

export const useCompanyDetail = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/superadmin/companies/${id}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error fetching company details')
      }

      return response.json()
    },
    enabled: !!id
  })
}