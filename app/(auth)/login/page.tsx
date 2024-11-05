import { redirect } from 'next/navigation'

import { cookieStore, tokenUtils } from '@/lib/auth'

import LoginMain from './login-main'

export default function LoginPage() {
  const token = cookieStore.get('auth_token')

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  return <LoginMain />
}