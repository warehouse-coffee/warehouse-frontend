import { NextResponse, NextRequest } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { InventoriesClient } from '../../../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const client = new InventoriesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const result = await client.getSafeStock(id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}