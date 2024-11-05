import { create } from 'zustand'
import { UserInfo } from '@/lib/auth'

interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  isChecked: boolean
  setAuth: (isAuthenticated: boolean, userInfo: UserInfo | null) => void
  clearAuth: () => void
  setChecked: (checked: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: null,
  isChecked: false,
  setAuth: (isAuthenticated, userInfo) => set({ isAuthenticated, userInfo }),
  clearAuth: () => set({ isAuthenticated: false, userInfo: null }),
  setChecked: (checked) => set({ isChecked: checked })
}))