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

    if (!token) {
      throw new Error('No auth tokens found')
    }

    await ApiClientService.logout(userId, token)

    cookieStore.delete('auth_token')

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Logout failed' }
  }
}

export async function checkAuth() {
  const token = cookieStore.get('auth_token')

  if (!token) return { isAuthenticated: false }

  try {
    const userInfo = tokenUtils.getUserInfo(token)
    return { isAuthenticated: true, userInfo }
  } catch {
    return { isAuthenticated: false }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await ApiClientService.resetPassword(token, newPassword)
    if (response.statusCode === 200) {
      return { success: true }
    }
    return { success: false, error: 'Failed to reset password' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

export async function validateResetToken(token: string) {
  try {
    const isValid = await ApiClientService.validateResetToken(token)
    return { success: isValid }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Invalid or expired token' }
  }
}

export async function checkEmailExists(email: string) {
  try {
    const exists = await ApiClientService.checkEmail(email)
    return { success: true, exists }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check email' }
  }
}