import { NextRequest, NextResponse } from 'next/server'

import { ApiClientService } from '@/lib/api-service'
import { cookieStore, tokenUtils } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const xsrfToken = await ApiClientService.getAntiforgeryToken(token)
    cookieStore.set('XSRF-TOKEN', xsrfToken, {
      httpOnly: false,
      secure: true
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/SuperAdmin/user/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': xsrfToken
      },
      body: formData,
      redirect: 'follow' as RequestRedirect
    })

    const text = await response.text()
    const result = text ? JSON.parse(text) : {}

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to update user' },
        { status: response.status }
      )
    }

    return NextResponse.json(result || { message: 'User updated successfully' })
  } catch (error) {
    console.error('Update user error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}