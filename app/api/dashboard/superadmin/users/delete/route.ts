import { NextRequest, NextResponse } from 'next/server'
import { getTokenCookie, isTokenValid, getUserInfoFromToken } from '@/lib/auth'
import { SuperAdminClient } from '../../../../web-api-client'

function canDeleteUser(userInfo: any, targetUserId: string) {
  if (userInfo?.userId !== targetUserId && userInfo?.role === 'Super-Admin') {
    return { canDelete: false, error: `You can't delete other Super-Admin users` }
  }
  if (targetUserId === userInfo?.userId) {
    return { canDelete: false, error: `You can't delete your own user` }
  }
  return { canDelete: true, error: null }
}

export async function DELETE(request: NextRequest) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userInfo = getUserInfoFromToken(token)

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
