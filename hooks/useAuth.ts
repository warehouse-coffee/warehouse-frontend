import { useState, useEffect } from 'react'

import { getUserInfo, isTokenValid, removeUserInfo, refreshToken } from '@/lib/auth'
import { UserInfo } from '@/lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (isTokenValid()) {
        setIsAuthenticated(true)
        const info = getUserInfo()
        setUserInfo(info)
      } else {
        try {
          await refreshToken()
          setIsAuthenticated(true)
          const info = getUserInfo()
          setUserInfo(info)
        } catch (error) {
          setIsAuthenticated(false)
          setUserInfo(null)
          removeUserInfo()
          window.location.href = '/login'
        }
      }
    }

    checkAuth()
    const intervalId = setInterval(checkAuth, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return { isAuthenticated, userInfo }
}