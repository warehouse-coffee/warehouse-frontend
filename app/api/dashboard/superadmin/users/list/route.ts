import { NextResponse } from 'next/server'

import { getTokenCookie, isTokenValid } from '@/lib/auth'

import { SuperAdminClient } from '../../../../web-api-client'

export async function GET(request: Request) {
  const token = getTokenCookie('auth_token')

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, undefined)
    const response = await client.getAllUsers()
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}