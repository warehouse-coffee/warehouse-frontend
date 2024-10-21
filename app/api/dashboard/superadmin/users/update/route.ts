import { NextRequest, NextResponse } from 'next/server'

import { getAuthCookie, isTokenValid, getXSRFCookie } from '@/lib/auth'

import { SuperAdminClient, SwaggerException, UpdateUserCommand } from '../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = getAuthCookie(request)
  const xsrfToken = getXSRFCookie(request)

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updateUserData = await request.json()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateUserCommand = new UpdateUserCommand({ ...updateUserData })

    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const result = await client.updateUser(updateUserCommand, id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json({ error: error.message, details: error.result }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}