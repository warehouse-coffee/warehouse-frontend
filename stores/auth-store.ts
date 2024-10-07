import { create } from 'zustand'

import { UserInfo } from '@/lib/auth'

interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  setAuth: (isAuthenticated: boolean, userInfo: UserInfo | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: null,
  setAuth: (isAuthenticated, userInfo) => {
    set({ isAuthenticated, userInfo })
  },
  clearAuth: () => {
    set({ isAuthenticated: false, userInfo: null })
  }
}))