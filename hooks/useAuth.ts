'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { login, logout, checkAuth } from '@/lib/actions'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const router = useRouter()
  const { isAuthenticated, userInfo, isChecked, setAuth, clearAuth, setChecked } = useAuthStore()

  useEffect(() => {
    if (!isChecked) {
      checkAuth().then(({ isAuthenticated, userInfo }) => {
        if (isAuthenticated && userInfo) {
          setAuth(true, userInfo)
          localStorage.setItem('authenticated', 'true')
        } else {
          clearAuth()
          const wasAuthenticated = localStorage.getItem('authenticated')
          if (wasAuthenticated) {
            const hasShownExpiredMessage = localStorage.getItem('hasShownExpiredMessage')
            if (!hasShownExpiredMessage) {
              toast.error('Your session has expired. Please log in again.', {
                duration: 5000
              })
              localStorage.setItem('hasShownExpiredMessage', 'true')
            }
          }
        }
        setChecked(true)
      })
    }
  }, [isChecked, setAuth, clearAuth, setChecked])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)
    if (result.success) {
      localStorage.setItem('authenticated', 'true')
      localStorage.removeItem('hasShownExpiredMessage')
      router.push('/dashboard')
      return true
    }
    toast.error(result.error)
    return false
  }

  const handleLogout = async (userId: string) => {
    try {
      const result = await logout(userId)
      if (result.success) {
        clearAuth()
        localStorage.removeItem('hasShownExpiredMessage')
        localStorage.removeItem('authenticated')
        router.push('/login')
        return true
      }
      toast.error(result.error)
      return false
    } catch (error) {
      toast.error('Logout failed')
      return false
    }
  }

  return {
    isAuthenticated,
    userInfo,
    login: handleLogin,
    logout: handleLogout
  }
}