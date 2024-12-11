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
import { resetPasswordSchema } from '@/configs/zod-schema'
import { resetPassword } from '@/lib/actions'
import { cn } from '@/lib/utils'

const BorderBeam = dynamic(() => import('@/components/magicui/border-beam'), { ssr: false })

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

interface ResetPasswordFormProps {
  resetToken: string
  email?: string
  tempPass?: string
  error?: string
}

export default function ResetPasswordForm({ resetToken, email, tempPass, error: initialError }: ResetPasswordFormProps) {
  const [error, setError] = useState(initialError || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (error) {
      toast.error('Invalid or expired token')
    }
  }, [error])

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      setIsLoading(true)
      const result = await resetPassword(resetToken, values.password)

      if (result.success) {
        toast.success('Password reset successfully')
        router.push('/login')
      } else {
        setError(result.error || 'Failed to reset password')
        toast.error(result.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred while resetting password')
      toast.error('An error occurred while resetting password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-7 shadow-input bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-200 dark:border-gray-800 relative z-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          Reset Password
        </h1>
        <p className="text-neutral-600 leading-6 text-sm max-w-sm dark:text-neutral-300">
          {email ? (
            <>
              Email: <span className="font-medium text-white">{email}</span>
              {tempPass && (
                <div className="mt-2">
                  Temporary Password: <span className="font-medium text-white">{tempPass}</span>
                </div>
              )}
            </>
          ) : (
            'Enter your new password'
          )}
        </p>
      </div>

      {error && (
        <div className="w-full h-11 flex items-center gap-[.6rem] px-4 rounded-md bg-[#ff000025] mt-4">
          <p className='text-red-500 font-medium text-sm'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <LabelInputContainer>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </LabelInputContainer>

        <button
          className={cn(
            'bg-gradient-to-br mt-6 relative flex items-center gap-4 justify-center group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-[.95rem] text-white rounded-md h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]',
            isLoading && 'cursor-not-allowed'
          )}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Processing...
              <Loader size='1.35rem' />
            </>
          ) : (
            'Reset Password'
          )}
          <BottomGradient />
        </button>

        <div className='flex items-center justify-center mt-5'>
          <Link href="/login" className={cn('flex items-center gap-2 text-muted-foreground text-sm transition-all duration-250 group hover:text-white', isLoading && 'cursor-not-allowed pointer-events-none')}>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to login</span>
          </Link>
        </div>
      </form>
      <BorderBeam size={120} duration={12} delay={9} />
    </div>
  )
}