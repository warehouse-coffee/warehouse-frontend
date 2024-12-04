import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { cookieStore, tokenUtils } from '@/lib/auth'

import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
  icons: {
    icon: '/icon.png'
  }
}

export default function ForgotPasswordPage() {
  const token = cookieStore.get('auth_token')

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  return <ForgotPasswordForm />
}