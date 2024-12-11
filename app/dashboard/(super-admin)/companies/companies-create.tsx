'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CreateCompanyCommand } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { companyFormSchema } from '@/configs/zod-schema'
import { useCreateCompany } from '@/hooks/company'
import { cn } from '@/lib/utils'

type FormValues = z.infer<typeof companyFormSchema>

interface CompanyCreateProps {
  onClose: () => void
}

export default function CompaniesCreate({ onClose }: CompanyCreateProps) {
  const createCompanyMutation = useCreateCompany(onClose)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyId: '',
      companyName: '',
      phoneContact: '',
      emailContact: ''
    }
  })

  const onSubmit = React.useCallback(async (data: FormValues) => {
    if (isSubmitting || createCompanyMutation.isPending) return

    setIsSubmitting(true)
    try {
      const command = new CreateCompanyCommand({
        companyId: data.companyId,
        companyName: data.companyName,
        phone: data.phoneContact,
        email: data.emailContact
      })
      await createCompanyMutation.mutateAsync(command)
    } catch (error) {
      console.error('Error creating company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [createCompanyMutation, isSubmitting])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="companyId" className="text-sm font-medium">
          Company ID <span className="text-red-500">*</span>
        </label>
        <Input
          id="companyId"
          placeholder="Enter company ID"
          {...register('companyId')}
          className={cn(errors.companyId && 'border-red-500')}
        />
        {errors.companyId && (
          <p className="text-sm text-red-500">{errors.companyId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="companyName" className="text-sm font-medium">
          Company Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="companyName"
          placeholder="Enter company name"
          {...register('companyName')}
          className={cn(errors.companyName && 'border-red-500')}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneContact" className="text-sm font-medium">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="phoneContact"
          placeholder="Enter phone number"
          {...register('phoneContact')}
          className={cn(errors.phoneContact && 'border-red-500')}
        />
        {errors.phoneContact && (
          <p className="text-sm text-red-500">{errors.phoneContact.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          {...register('emailContact')}
          className={cn(errors.emailContact && 'border-red-500')}
        />
        {errors.emailContact && (
          <p className="text-sm text-red-500">{errors.emailContact.message}</p>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          className={cn('bg-accent')}
          onClick={() => reset()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            createCompanyMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {createCompanyMutation.isPending ? (
            <>
              Creating...
              <Loader size="1.25rem" />
            </>
          ) : (
            'Create Company'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
