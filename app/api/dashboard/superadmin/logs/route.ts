import { NextResponse } from 'next/server'

import { getTokenCookie, isTokenValid } from '@/lib/auth'

import { GetLogListQuery, Page, LogsClient } from '../../../web-api-client'

export async function GET(request: Request) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '')
    const size = parseInt(searchParams.get('size') || '')
    const date = searchParams.get('date')
    const typeLog = searchParams.get('typeLog')
    const hour = parseInt(searchParams.get('hour') || '')

    const client = new LogsClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetLogListQuery({
      page: page,
      // date: date ? new Date(date) : undefined,
      // typeLog: typeLog || undefined,
      // hour: hour
    })

    const result = await client.getLogs(query)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
