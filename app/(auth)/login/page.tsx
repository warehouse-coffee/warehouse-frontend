import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { cookieStore, tokenUtils } from '@/lib/auth'

import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Login',
  icons: {
    icon: '/icon.png'
  }
}

export default function LoginPage() {
  const token = cookieStore.get('auth_token')

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  return <LoginForm />
}