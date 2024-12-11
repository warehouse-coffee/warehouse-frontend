import { useSuspenseQuery } from '@tanstack/react-query'

import { ReportVM } from '@/app/api/web-api-client'
import { API_ENDPOINTS } from '@/constants'

const fetchReportStorages = async (dateStart: Date, dateEnd: Date): Promise<ReportVM> => {
  const response = await fetch(`${API_ENDPOINTS.GET_REPORT_STORAGE}?dateStart=${dateStart.toISOString()}&dateEnd=${dateEnd.toISOString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch report storages')
  }
  return response.json()
}

export const useReportStorage = (dateStart: Date, dateEnd: Date) => {
  return useSuspenseQuery<ReportVM>({
    queryKey: ['reportStorages', dateStart.toISOString(), dateEnd.toISOString()],
    queryFn: () => fetchReportStorages(dateStart, dateEnd),
    staleTime: 0,
    refetchOnWindowFocus: false
  })
}