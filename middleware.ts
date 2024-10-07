import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getAuthCookie, isTokenValid } from '@/lib/auth'

const protectedRoutes = ['/dashboard']
// const isDev = process.env.NODE_ENV === 'development'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isLoginPage = path === '/login'

  const token = getAuthCookie(request)
  const isValidToken = token && isTokenValid(token)

  if (isValidToken) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|images|icons|fonts|css|js|robots.txt|favicon.ico|login).*)'
  ]
}