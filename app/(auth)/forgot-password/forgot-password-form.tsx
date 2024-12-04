'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { ApiClientService } from '@/lib/api-service'
import { cn } from '@/lib/utils'

const BorderBeam = dynamic(() => import('@/components/magicui/border-beam'), { ssr: false })

// Form schema for cases with reset token (new user or forgot password)
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

// Form schema for sending password reset email
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email')
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

interface ForgotPasswordFormProps {
  resetToken?: string
  error?: string
  email?: string // Email from URL (for new user case)
}

export default function ForgotPasswordForm({ resetToken, error: initialError, email: initialEmail }: ForgotPasswordFormProps) {
  const [error, setError] = useState(initialError || '')
  const router = useRouter()

  useEffect(() => {
    if (initialError === 'invalid-token') {
      setError('Password reset link is invalid or has expired')
    }
  }, [initialError])

  // Form with reset token
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail || '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Form for sending password reset email
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmitReset(data: ResetPasswordValues) {
    setError('')
    try {
      await ApiClientService.resetPassword(resetToken!, data.newPassword)

      toast.success('Success!', {
        description: 'Password has been reset. Please login.',
        duration: 3000
      })

      router.push('/login')
    } catch (error) {
      setError('An error occurred while resetting password')
    }
  }

  async function onSubmitForgot(data: ForgotPasswordValues) {
    setError('')
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email
        })
      })

      if (!response.ok) {
        throw new Error('An error occurred while sending email')
      }

      toast.success('Email has been sent!', {
        description: 'Please check your email to reset your password.',
        duration: 3000
      })
    } catch (error) {
      setError('An error occurred while sending email')
    }
  }

  const formContent = resetToken ? (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-7 shadow-input bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-200 dark:border-gray-800 relative z-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          {initialEmail ? 'Create Password' : 'Reset Password'}
        </h1>
        <p className="text-neutral-600 leading-6 text-sm max-w-sm dark:text-neutral-300">
          {initialEmail ? 'Create a password for your account' : 'Enter your new password'}
        </p>
      </div>

      {error && (
        <div className="w-full h-11 flex items-center gap-[.6rem] px-4 rounded-md bg-[#ff000025] mt-4">
          <p className='text-red-500 font-medium text-sm'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmitReset(onSubmitReset)} className="mt-8 space-y-4">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...registerReset('email')}
            disabled={!!initialEmail}
          />
          {errorsReset.email && (
            <p className="text-red-500 text-sm">{errorsReset.email.message}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            {...registerReset('newPassword')}
          />
          {errorsReset.newPassword && (
            <p className="text-red-500 text-sm">{errorsReset.newPassword.message}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...registerReset('confirmPassword')}
          />
          {errorsReset.confirmPassword && (
            <p className="text-red-500 text-sm">{errorsReset.confirmPassword.message}</p>
          )}
        </LabelInputContainer>

        <button
          className={cn(
            'bg-gradient-to-br mt-6 relative flex items-center gap-4 justify-center group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-[.95rem] text-white rounded-md h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]',
            isSubmittingReset && 'cursor-not-allowed'
          )}
          type="submit"
          disabled={isSubmittingReset}
        >
          {isSubmittingReset ? (
            <>
              Processing...
              <Loader size='1.35rem' />
            </>
          ) : (
            initialEmail ? 'Create Password' : 'Reset Password'
          )}
          <BottomGradient />
        </button>

        <div className='flex items-center justify-center mt-5'>
          <Link
            href='/login'
            className='text-muted-foreground text-sm flex items-center gap-2 transition-all group hover:text-white'
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Login</span>
          </Link>
        </div>
      </form>
      <BorderBeam size={120} duration={12} delay={9} />
    </div>
  ) : (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-7 shadow-input bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-200 dark:border-gray-800 relative z-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          Forgot Password
        </h1>
        <p className="text-neutral-600 leading-6 text-sm max-w-sm dark:text-neutral-300">
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <div className="w-full h-11 flex items-center gap-[.6rem] px-4 rounded-md bg-[#ff000025] mt-4">
          <p className='text-red-500 font-medium text-sm'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmitForgot(onSubmitForgot)} className="mt-8 space-y-4">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...registerForgot('email')}
          />
          {errorsForgot.email && (
            <p className="text-red-500 text-sm">{errorsForgot.email.message}</p>
          )}
        </LabelInputContainer>

        <button
          className={cn(
            'bg-gradient-to-br mt-6 relative flex items-center gap-4 justify-center group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-[.95rem] text-white rounded-md h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]',
            isSubmittingForgot && 'cursor-not-allowed'
          )}
          type="submit"
          disabled={isSubmittingForgot}
        >
          {isSubmittingForgot ? (
            <>
              Processing...
              <Loader size='1.35rem' />
            </>
          ) : (
            'Send Password Reset Link'
          )}
          <BottomGradient />
        </button>

        <div className='flex items-center justify-center mt-5'>
          <Link
            href='/login'
            className='text-muted-foreground text-sm flex items-center gap-2 transition-all group hover:text-white'
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Login</span>
          </Link>
        </div>
      </form>
      <BorderBeam size={120} duration={12} delay={9} />
    </div>
  )

  return formContent
}