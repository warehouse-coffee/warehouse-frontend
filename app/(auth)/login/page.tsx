'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/hooks/useAuth'

import { LoginForm } from './login-form'
import { LoginMain } from './login-main'

export default function Login() {
  const router = useRouter()
  const { checkAuth } = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      const isAuthenticated = await checkAuth()
      if (isAuthenticated) {
        router.replace('/dashboard')
      }
    }
    handleAuth()
  }, [])

  return (
    <LoginMain>
      <LoginForm />
    </LoginMain>
  )
}