'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { forgotPasswordSchema } from '@/configs/zod-schema'
import { checkEmailExists } from '@/lib/actions'
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

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setIsLoading(true)
      setError('')

      const emailCheck = await checkEmailExists(values.email)

      if (!emailCheck.success || !emailCheck.exists) {
        setError('No account found with this email address')
        return
      }

      toast.success('Check your email', {
        description: 'We have sent you a password reset link',
        duration: 5000
      })

      router.push('/login')
    } catch (error) {
      setError('An error occurred while sending the reset password email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-[25rem] max-w-md mx-auto rounded-none md:rounded-2xl p-7 shadow-input bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-200 dark:border-gray-800 relative z-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          Forgot Password
        </h1>
        <p className="text-neutral-600 leading-6 text-sm max-w-sm dark:text-neutral-300">
          Enter your email address and we&apos;ll send you a link to reset your password
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
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
            'Send Reset Link'
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