import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ApiClientService } from '@/lib/api-service'
import { cookieStore, tokenUtils } from '@/lib/auth'

import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password',
  icons: {
    icon: '/icon.png'
  }
}

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = cookieStore.get('auth_token')

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  const resetToken = searchParams.token as string | undefined
  const email = searchParams.email as string | undefined
  const tempPass = searchParams.pass as string | undefined
  const error = searchParams.error as string | undefined

  // Skip token validation in development
  if (process.env.NODE_ENV === 'production' && resetToken) {
    try {
      const userData = await ApiClientService.validateResetToken(resetToken)
      if (!userData) {
        redirect('/login?error=invalid-token')
      }
    } catch (error) {
      redirect('/login?error=invalid-token')
    }
  }

  return (
    <ResetPasswordForm
      resetToken={resetToken || 'development-token'}
      email={email}
      tempPass={tempPass}
      error={error}
    />
  )
}
