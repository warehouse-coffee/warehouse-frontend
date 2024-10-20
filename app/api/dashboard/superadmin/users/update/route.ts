import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, isTokenValid } from '@/lib/auth'
import { SuperAdminClient } from '../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = getAuthCookie(request)
  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updateUserCommand = await request.json()
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token)
    const result = await client.updateUser(updateUserCommand)
    // console.log(result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}