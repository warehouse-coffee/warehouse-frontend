import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { isTokenValid } from '@/lib/auth'

const protectedRoutes = ['/dashboard']
// const publicRoutes = ['/login', '/']

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  // const isPublicRoute = publicRoutes.includes(path)

  if (isProtectedRoute) {
    const token = req.cookies.get('token')?.value
    if (!token || !isTokenValid()) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
