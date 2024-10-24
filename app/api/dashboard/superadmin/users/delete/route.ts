import { NextRequest, NextResponse } from 'next/server'

import { getTokenCookie, isTokenValid } from '@/lib/auth'

import { SuperAdminClient } from '../../../../web-api-client'

export async function DELETE(request: NextRequest) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const result = await client.deleteUser(id)
    return NextResponse.json(result)
  } catch (error) {
    // console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}