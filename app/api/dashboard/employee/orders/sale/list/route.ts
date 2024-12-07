import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { OrdersClient, Page, GetSaleOrderListQuery } from '../../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')
    const client = new OrdersClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetSaleOrderListQuery({
      page: page
    })

    const result = await client.getSaleOrderList(query)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching sale orders:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}