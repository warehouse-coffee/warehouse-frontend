import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getAuthCookie, isTokenValid } from '@/lib/auth'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login']
// const isDev = process.env.NODE_ENV === 'development'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  const token = getAuthCookie(request)
  const isValidToken = token && isTokenValid(token)

  if (isPublicRoute && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|images|icons|fonts|css|js|robots.txt|favicon.ico|login).*)',
    '/dashboard/:path*'
  ]
}