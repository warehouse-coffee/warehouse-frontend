import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { ProductsClient } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const productsClient = new ProductsClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const result = await productsClient.getProductsOrder()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product order' }, { status: 500 })
  }
}