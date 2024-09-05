import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'

// const TOKEN_EXPIRATION_TIME = 3600
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface UserInfo extends JwtPayload {
  email?: string;
  role?: string;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export async function login(email: string, password: string): Promise<UserInfo> {
  try {
    const response = await api.post('/login', { email, password })
    if (response.status !== 200 || !response.data.user) {
      throw new Error(response.data.error || 'Login Failed!!!')
    }
    const userInfo = response.data.user
    setUserInfo(userInfo)
    return userInfo
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Login Failed!!!')
    }
    throw error
  }
}

export async function logout(): Promise<void> {
  await api.post('/logout')
  removeUserInfo()
}

export async function refreshToken(): Promise<void> {
  try {
    const response = await api.post('/refresh-token')
    const userInfo = jwtDecode<UserInfo>(response.data.token)
    setUserInfo(userInfo)
  } catch (error) {
    removeUserInfo()
    throw error
  }
}

export function setUserInfo(userInfo: UserInfo): void {
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function getUserInfo(): UserInfo | null {
  const userInfoString = sessionStorage.getItem('userInfo')
  return userInfoString ? JSON.parse(userInfoString) : null
}

export function removeUserInfo(): void {
  sessionStorage.removeItem('userInfo')
}

export function isTokenValid(): boolean {
  const userInfo = getUserInfo()
  if (!userInfo || !userInfo.exp) return false
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime < userInfo.exp
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await refreshToken()
        return api(originalRequest)
      } catch (refreshError) {
        removeUserInfo()
        throw refreshError
      }
    }
    return Promise.reject(error)
  }
)