import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { ProductsClient, Page, GetProductListQuery } from '../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')

    const productsClient = new ProductsClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetProductListQuery({
      page: page,
      filters: []
    })

    const result = await productsClient.getProductList(query)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product order' }, { status: 500 })
  }
}