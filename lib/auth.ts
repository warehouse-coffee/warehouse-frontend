import { jwtDecode, JwtPayload } from 'jwt-decode'
import { cookies } from 'next/headers'

export interface UserInfo extends JwtPayload {
  role: string
  username: string
  avatar: string
  userId: string
}

export const cookieStore = {
  get: (name: string) => cookies().get(name)?.value,

  set: (name: string, value: string, options = {}) => {
    cookies().set(name, value, {
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      ...options
    })
  },

  delete: (name: string) => cookies().delete(name)
}

export const tokenUtils = {
  isValid: (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<UserInfo>(token)
      return decodedToken.exp ? Math.floor(Date.now() / 1000) < decodedToken.exp : false
    } catch {
      return false
    }
  },

  getUserInfo: (token: string): UserInfo | null => {
    try {
      return jwtDecode<UserInfo>(token)
    } catch {
      return null
    }
  }
}