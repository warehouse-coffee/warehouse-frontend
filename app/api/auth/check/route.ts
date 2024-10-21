import { NextResponse } from 'next/server'

import { getAuthCookie, isTokenValid, getUserInfoFromToken, getXSRFCookie } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getAuthCookie(request)
  const xsrfToken = getXSRFCookie(request)

  if (token && isTokenValid(token) && xsrfToken) {
    const userInfo = getUserInfoFromToken(token)
    return NextResponse.json({ isAuthenticated: true, userInfo })
  } else {
    return NextResponse.json({ isAuthenticated: false, userInfo: null })
  }
}