'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

import { cn } from '@/lib/utils'

const DotPattern = dynamic(() => import('@/components/magicui/dot-pattern'), { ssr: false })
import ForgotPasswordForm from './forgot-password-form'

export default function ForgotPasswordMain({
  resetToken,
  error
}: {
  resetToken?: string
  error?: string
}) {
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
        <ForgotPasswordForm resetToken={resetToken} error={error} />
      </motion.div>
    </div>
  )
}