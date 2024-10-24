import { NextResponse } from 'next/server'

import { getTokenCookie, isTokenValid, getUserInfoFromToken } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  if (token && isTokenValid(token) && xsrfToken) {
    const userInfo = getUserInfoFromToken(token)
    return NextResponse.json({ isAuthenticated: true, userInfo })
  } else {
    return NextResponse.json({ isAuthenticated: false, userInfo: null })
  }
}