import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { GetLogListQuery, Page, LogsClient } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')

    const client = new LogsClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetLogListQuery({
      page: page
    })

    const result = await client.getLogs(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}