import { NextRequest, NextResponse } from 'next/server'

import { getAuthCookie, getXSRFCookie, isTokenValid } from '@/lib/auth'

import { SuperAdminClient, CreateUserCommand, SwaggerException } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = getAuthCookie(request)
  const xsrfToken = getXSRFCookie(request)

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const createUserData = await request.json()
    const createUserCommand = new CreateUserCommand({ ...createUserData })
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const result = await client.userRegister(createUserCommand)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json({ error: error.message, details: error.result }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
