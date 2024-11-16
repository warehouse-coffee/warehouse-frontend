import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { SuperAdminClient, UserRegister, CreateUserCommand, SwaggerException } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const createUserData = await request.json()
    const userRegister = UserRegister.fromJS(createUserData.userRegister)
    const createUserCommand = new CreateUserCommand({
      userRegister: userRegister
    })

    const client = new SuperAdminClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token,
      xsrfToken
    )
    const result = await client.userRegister(createUserCommand)

    if (result.statusCode === 400 && result.data?.id && result.message?.includes('mail Fail')) {
      return NextResponse.json({
        statusCode: 200,
        message: result.message,
        data: result.data
      })
    }

    if (result.statusCode === 400) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json(
        { error: error.message, details: error.result },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}