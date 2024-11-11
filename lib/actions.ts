'use server'

import { ApiClientService } from './api-service'
import { cookieStore, tokenUtils } from './auth'

export async function login(email: string, password: string) {
  try {
    const res = await ApiClientService.signIn(email, password)

    if (res.statusCode === 200 && res.token && typeof res.token === 'string') {
      cookieStore.set('auth_token', res.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24
      })

      const xsrfToken = await ApiClientService.getAntiforgeryToken(res.token)
      cookieStore.set('XSRF-TOKEN', xsrfToken, {
        httpOnly: false,
        secure: true
      })

      return { success: true }
    }
    return { success: false, error: 'Login failed' }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function logout(userId: string) {
  try {
    const token = cookieStore.get('auth_token')
    const xsrfToken = cookieStore.get('XSRF-TOKEN')

    if (!token || !xsrfToken) {
      throw new Error('No auth tokens found')
    }

    await ApiClientService.logout(userId, token, xsrfToken)

    cookieStore.delete('auth_token')
    cookieStore.delete('XSRF-TOKEN')

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Logout failed' }
  }
}

export async function checkAuth() {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !xsrfToken) return { isAuthenticated: false }

  try {
    const userInfo = tokenUtils.getUserInfo(token)
    return { isAuthenticated: true, userInfo }
  } catch {
    return { isAuthenticated: false }
  }
}