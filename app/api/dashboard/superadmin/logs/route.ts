import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { GetLogListQuery, Page, LogsClient } from '../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')
    const client = new LogsClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)

    const pageData = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const dateParam = searchParams.get('date')
    const typeLogParam = searchParams.get('typeLog')
    const hourParam = searchParams.get('hour')

    const date = dateParam ? new Date(dateParam) : undefined
    const typeLog = typeLogParam || undefined
    const hour = hourParam ? parseInt(hourParam) : undefined

    const query = new GetLogListQuery({
      page: pageData,
      date: date,
      typeLog: typeLog,
      hour: hour
    })

    const result = await client.getLogs(query)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}