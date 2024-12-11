import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { InventoriesClient, Page, GetInventoriesByStorageQuery } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')
    const storageId = parseInt(searchParams.get('storageId') || '0')

    const client = new InventoriesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetInventoriesByStorageQuery({
      storageId: storageId,
      page: page,
      filters: []
    })

    const result = await client.getInventoriesByStorage(query)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}