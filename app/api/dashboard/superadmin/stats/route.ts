import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { SuperAdminClient } from '../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = new SuperAdminClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token
    )

    const result = await client.getSuperAdminStats()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}