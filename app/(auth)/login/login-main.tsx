'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const DotPattern = dynamic(() => import('@/components/magicui/dot-pattern'), { ssr: false })

import LoginForm from './login-form'

export default function LoginMain() {
  const { checkAuth } = useAuth()
  const router = useRouter()

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
    <div className="w-full min-h-screen overflow-hidden rounded-md bg-neutral-950 relative flex flex-col items-center justify-center">
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
        )}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginForm />
      </motion.div>
    </div>
  )
}