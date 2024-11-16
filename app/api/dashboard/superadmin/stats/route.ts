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

    try {
      const result = await client.getSuperAdminStats()
      return NextResponse.json(result)
    } catch (clientError: any) {
      console.error('Client error:', {
        message: clientError.message,
        status: clientError.status,
        response: clientError.response
      })
      return NextResponse.json(
        { error: clientError.message || 'Failed to fetch stats' },
        { status: clientError.status || 400 }
      )
    }
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