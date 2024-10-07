import { NextResponse } from 'next/server'

import { getAuthCookie, isTokenValid, getUserInfoFromToken } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getAuthCookie(request)

  if (token && isTokenValid(token)) {
    const userInfo = getUserInfoFromToken(token)
    return NextResponse.json({ isAuthenticated: true, userInfo })
  } else {
    return NextResponse.json({ isAuthenticated: false, userInfo: null })
  }
}