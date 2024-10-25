import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth-store'

const { clearAuth, setAuth, setChecked, isChecked } = useAuthStore.getState()

export const authService = {
  checkAuth: async () => {
    if (isChecked) return

    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      const data = await response.json()

      if (data.isAuthenticated) {
        setAuth(true, data.userInfo)
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
      clearAuth()
    }
    setChecked(true)
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const result = await response.json()

      if (result.success) {
        setAuth(true, result.userInfo)
        return true
      }

      toast.error(result.error || 'Login failed. Please check your credentials.')
      return false
    } catch (error) {
      toast.error('An unexpected error occurred')
      return false
    }
  },

  logout: async (id: string) => {
    try {
      const response = await fetch(`/api/auth/logout?id=${id}`, {
        method: 'POST',
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        clearAuth()
        authService.clearExpiredMessage()
        return true
      }

      toast.error('Logout failed. Please try again.')
      return false
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An unexpected error occurred during logout')
      return false
    }
  },

  clearExpiredMessage: () => {
    localStorage.removeItem('hasShownExpiredMessage')
    localStorage.setItem('authenticated', 'true')
  }
}
