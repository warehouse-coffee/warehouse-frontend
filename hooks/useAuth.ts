import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, userInfo, isChecked } = useAuthStore()

  const { checkAuth, login, logout, clearExpiredMessage } = authService

  useEffect(() => {
    if (!isChecked) {
      checkAuth()
    }
  }, [isChecked])

  useEffect(() => {
    if (isChecked && isAuthenticated && pathname === '/login') {
      router.replace('/dashboard')
    }
  }, [isChecked, isAuthenticated, pathname, router])

  return {
    isAuthenticated,
    userInfo,
    login,
    logout,
    clearExpiredMessage
  }
}
