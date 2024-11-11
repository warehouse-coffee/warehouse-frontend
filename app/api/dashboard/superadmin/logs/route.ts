import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { GetLogListQuery, Page, LogsClient } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')

    const client = new LogsClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token, xsrfToken)

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetLogListQuery({
      page: page
    })

    const result = await client.getLogs(query)

    // console.log('API Response:', {
    //   totalElements: result.page?.totalElements,
    //   pageSize: size,
    //   currentPage: pageNumber,
    //   totalPages: result.page?.totalPages,
    //   data: result.logVMs?.length
    // })

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}