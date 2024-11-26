import { NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { OrdersClient } from '../../../../web-api-client'

export async function GET() {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = new OrdersClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.getTopOrder()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching import orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top orders' },
      { status: 500 }
    )
  }
}