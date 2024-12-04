import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ApiClientService } from '@/lib/api-service'
import { cookieStore, tokenUtils } from '@/lib/auth'

import ForgotPasswordMain from './forgot-password-main'

export const metadata: Metadata = {
  title: 'Forgot Password',
  icons: {
    icon: '/icon.png'
  }
}

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = cookieStore.get('auth_token')

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  const resetToken = searchParams.token as string | undefined

  if (resetToken) {
    try {
      const userData = await ApiClientService.validateResetToken(resetToken)
      if (!userData) {
        redirect('/forgot-password?error=invalid-token')
      }
    } catch (error) {
      redirect('/forgot-password?error=invalid-token')
    }
  }

  const error = searchParams.error as string | undefined

  return <ForgotPasswordMain resetToken={resetToken} error={error} />
}