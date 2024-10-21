import { NextRequest, NextResponse } from 'next/server'

import { getAuthCookie, isTokenValid } from '@/lib/auth'

import { SuperAdminClient } from '../../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = getAuthCookie(request)

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, undefined)
    const result = await client.getUserDetail(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
  }
}