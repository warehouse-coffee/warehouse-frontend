import { redirect } from 'next/navigation'

import { isTokenValid, getTokenCookie } from '@/lib/auth'

import LoginMain from './login-main'

export default function LoginPage() {
  const token = getTokenCookie('auth_token')

  if (token && isTokenValid(token)) {
    redirect('/dashboard')
  }

  return <LoginMain />
}
