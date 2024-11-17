import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    console.error('Unauthorized request: Missing or invalid token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      console.error('User ID is missing in the request parameters')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    const tokenX = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/antiforgery/token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const cookies = tokenX.headers.get('Set-Cookie')

    const xsrfToken = await tokenX.text()
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/SuperAdmin/user/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': xsrfToken,
        'Cookie': cookies || ''
      },
      body: formData,
      redirect: 'follow'
    })

    const text = await response.text()

    if (!response.ok) {
      try {
        const result = text ? JSON.parse(text) : {}
        return NextResponse.json(
          { error: result.message || 'Failed to update user' },
          { status: response.status }
        )
      } catch (parseError) {
        console.error('Failed to parse response body as JSON:', parseError)
        return NextResponse.json(
          { error: text || 'Failed to update user' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json(text || { message: 'User updated successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
