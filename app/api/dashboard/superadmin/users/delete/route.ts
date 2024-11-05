import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { SuperAdminClient } from '../../../../web-api-client'

function canDeleteUser(userInfo: any, targetUserId: string) {
  if (userInfo?.role === 'Super-Admin') {
    if (targetUserId === userInfo?.userId) {
      return { canDelete: false, error: 'You can\'t delete your own user' }
    }
    return { canDelete: true, error: null }
  }

  return { canDelete: false, error: 'You don\'t have permission to delete users' }
}

export async function DELETE(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userInfo = tokenUtils.getUserInfo(token)

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { canDelete, error } = canDeleteUser(userInfo, id)
    if (!canDelete) {
      return NextResponse.json({ error }, { status: 403 })
    }

    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)

    const result = await client.deleteUser(id)
    return NextResponse.json(result)
  } catch (error: any) {
    // console.error('Error deleting user:', error)
    const errorMessage = error.message || 'Failed to delete user'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}