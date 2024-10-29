import { NextResponse } from 'next/server'

import { getTokenCookie } from '@/lib/auth'

import { IdentityUserClient } from '../../web-api-client'

export async function POST(request: Request) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  try {
    const client = new IdentityUserClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    const result = await client.logout(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}