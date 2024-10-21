import { jwtDecode, JwtPayload } from 'jwt-decode'
import { NextResponse } from 'next/server'

export interface UserInfo extends JwtPayload {
  role: string;
  username: string;
  avatar: string;
}

interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  maxAge?: number
  path?: string
}

const defaultCookieOptions: CookieOptions = {
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict',
  path: '/'
}

function setCookie(response: NextResponse, name: string, value: string, options: CookieOptions = {}) {
  response.cookies.set(name, value, {
    ...defaultCookieOptions,
    ...options
  })
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

function getCookieFromRequest(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined
  return parseCookies(cookieHeader)[name]
}

function parseCookies(cookieString: string): { [key: string]: string } {
  return cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as { [key: string]: string })
}

export function setAuthCookie(response: NextResponse, token: string) {
  setCookie(response, 'auth_token', token, { httpOnly: true, maxAge: 3600 })
}

export function getAuthCookie(request: Request): string | undefined {
  return getCookieFromRequest(request, 'auth_token')
}

export function setXSRFCookie(response: NextResponse, token: string) {
  setCookie(response, 'XSRF-TOKEN', token, { httpOnly: false, secure: true, path: '/' })
}

export function getXSRFCookie(request: Request): string | undefined {
  return getCookieFromRequest(request, 'XSRF-TOKEN')
}

export function isTokenValid(token: string): boolean {
  try {
    const decodedToken = jwtDecode<UserInfo>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    return decodedToken.exp ? currentTime < decodedToken.exp : false
  } catch (error) {
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