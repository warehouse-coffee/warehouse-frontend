'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { UpdateCompanyCommand } from '@/app/api/web-api-client'
import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { useGetCompanyDetail, useUpdateCompany } from '@/hooks/company'
import { cn } from '@/lib/utils'
import { companyFormSchema } from '@/configs/zod-schema'

type FormValues = z.infer<typeof companyFormSchema>

interface CompanyUpdateProps {
  companyId: string
  onSuccess: () => void
}

export function CompanyUpdate({ companyId, onSuccess }: CompanyUpdateProps) {
  const { data: company, isLoading } = useGetCompanyDetail(companyId)
  const updateCompanyMutation = useUpdateCompany(companyId)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyId: '',
      companyName: '',
      phoneContact: '',
      emailContact: ''
    }
  })

  useEffect(() => {
    if (company) {
      form.reset({
        companyId: company.companyId || '',
        companyName: company.companyName || '',
        phoneContact: company.phoneContact || '',
        emailContact: company.emailContact || ''
      })
    }
  }, [company, form])

  const onSubmit = React.useCallback(async (data: FormValues) => {
    if (isSubmitting || updateCompanyMutation.isPending) return
    setIsSubmitting(true)
    try {
      const command = new UpdateCompanyCommand({
        companyId: data.companyId,
        companyName: data.companyName,
        phone: data.phoneContact,
        email: data.emailContact
      })
      await updateCompanyMutation.mutateAsync(command)
      onSuccess()
    } catch (error) {
      console.error('Error updating company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [updateCompanyMutation, isSubmitting, onSuccess])

  if (isLoading) {
    return <DashboardFetchLoader />
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company ID <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter company ID" required {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" className={cn('bg-accent')} onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            className={cn(
              'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
              updateCompanyMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
            )}
          >
            {updateCompanyMutation.isPending ? (
              <>
              Saving...
                <Loader color="#62c5ff" size="1.25rem" />
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}