import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value
    if (!token) return NextResponse.redirect(new URL('/login', request.url))

    try {
      const decodedToken = jwtDecode(token)
      if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) return NextResponse.redirect(new URL('/login', request.url))
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|images|icons|fonts|css|js|robots.txt|favicon.ico|login).*)'
  ]
}