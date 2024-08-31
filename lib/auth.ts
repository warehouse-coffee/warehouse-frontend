import { jwtDecode } from 'jwt-decode'

export interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const isTokenValid = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    const decodedToken = jwtDecode<DecodedToken>(token)
    return decodedToken.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = getToken()
  if (!token) return null

  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}