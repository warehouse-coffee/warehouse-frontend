import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { SuperAdminClient, CreateUserCommand, SwaggerException } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const createUserData = await request.json()
    console.log(createUserData)
    const createUserCommand = new CreateUserCommand({ ...createUserData })
    const client = new SuperAdminClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token, xsrfToken)
    const result = await client.userRegister(createUserCommand)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json({ error: error.message, details: error.result }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
