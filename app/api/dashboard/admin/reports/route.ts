import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { ReportStorageClient, ReportVM } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  // using UTC date to avoid timezone issues
  const dateStart = new Date(searchParams.get('dateStart') || '')
  const dateEnd = new Date(searchParams.get('dateEnd') || '')
  try {
    const client = new ReportStorageClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const result: ReportVM = await client.getReportStorage(dateStart, dateEnd)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
