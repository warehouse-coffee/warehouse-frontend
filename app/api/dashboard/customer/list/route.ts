import { NextResponse, NextRequest } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { CustomersClient } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = new CustomersClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const result = await client.getCustomerOfCompany()

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}