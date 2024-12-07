import type { Metadata } from 'next'

import ReportStorages from './report-storages'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function ReportStoragesPage() {
  return <ReportStorages />
}