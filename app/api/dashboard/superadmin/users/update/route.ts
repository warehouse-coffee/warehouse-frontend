import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { SuperAdminClient, SwaggerException, UpdateUserCommand } from '../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const updateUserData = Object.fromEntries(formData)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateUserCommand = UpdateUserCommand.fromJS({ ...updateUserData })

    const client = new SuperAdminClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token,
      xsrfToken
    )
    const result = await client.updateUser(updateUserCommand, id)
    return NextResponse.json(result)
  } catch (error) {
    // console.error('Update user error:', error)
    if (error instanceof SwaggerException) {
      return NextResponse.json(
        { error: error.message, details: error.result },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}