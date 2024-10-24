import { jwtDecode, JwtPayload } from 'jwt-decode'
import { cookies } from 'next/headers'

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

function setCookie(name: string, value: string, options: CookieOptions = {}) {
  cookies().set(name, value, {
    ...defaultCookieOptions,
    ...options
  })
}

export function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return cookies().get(name)?.value
  }
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function setAuthCookie(token: string) {
  setCookie('auth_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 })
}

export function setXSRFCookie(token: string) {
  setCookie('XSRF-TOKEN', token, { httpOnly: false, secure: true })
}

export function getTokenCookie(name: string) {
  return getCookie(name)
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