import { jwtDecode, JwtPayload } from 'jwt-decode'
import { NextResponse } from 'next/server'

export interface UserInfo extends JwtPayload {
  role: string;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/'
  })
}

export function getAuthCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as { [key: string]: string })

  return cookies['auth_token']
}

export function isTokenValid(token: string): boolean {
  try {
    const decodedToken = jwtDecode<UserInfo>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    const isValid = decodedToken.exp ? currentTime < decodedToken.exp : false
    // console.log('Token validation:', { isValid, exp: decodedToken.exp, currentTime })
    return isValid
  } catch (error) {
    // console.error('Error validating token:', error)
    return false
  }
}

export function getUserInfoFromToken(token: string): UserInfo | null {
  try {
    return jwtDecode<UserInfo>(token)
  } catch {
    return null
  }
}