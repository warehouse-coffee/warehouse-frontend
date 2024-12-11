import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { OrdersClient, GetImportOrderListQuery, Page } from '../../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')

    const client = new OrdersClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)

    const pageData = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetImportOrderListQuery({
      page: pageData
    })

    const response = await client.getImportOrderList(query)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching import orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch import orders' },
      { status: 500 }
    )
  }
}