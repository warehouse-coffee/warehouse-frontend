'use client'

import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, userInfo, setAuth, clearAuth } = useAuthStore()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      const data = await response.json()

      if (data.isAuthenticated) {
        setAuth(true, data.userInfo)
        localStorage.removeItem('hasShownExpiredMessage')
        return true
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
    } catch (error) {
      // console.error('Error checking auth:', error)
      clearAuth()
      return false
    }
  }

  const initAuth = async () => {
    const isAuth = await checkAuth()
    if (isAuth && pathname === '/login') {
      router.replace('/dashboard')
    }
  }

  const clearExpiredMessage = () => {
    localStorage.removeItem('hasShownExpiredMessage')
    localStorage.setItem('authenticated', 'true')
  }

  return { isAuthenticated, userInfo, clearExpiredMessage, checkAuth, initAuth }
}
