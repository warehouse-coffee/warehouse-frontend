import { Metadata } from 'next'
import { redirect } from 'next/navigation'

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
  const email = searchParams.email as string
  const tempPass = searchParams.pass as string | undefined
  const error = searchParams.error as string | undefined

  if (token && tokenUtils.isValid(token)) {
    redirect('/dashboard')
  }

  if (!email) {
    redirect('/login?error=email-required')
  }

  return (
    <ResetPasswordForm
      email={email || ''}
      tempPass={tempPass || ''}
      error={error || ''}
    />
  )
}
