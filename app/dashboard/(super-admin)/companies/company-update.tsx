'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { UpdateCompanyCommand } from '@/app/api/web-api-client'
import DashboardFetchLoader from '@/components/dashboard/dashboard-fetch-loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetCompanyDetail } from '@/hooks/company/useGetCompanyDetail'
import { useUpdateCompany } from '@/hooks/company/useUpdateCompany'

// Validation schema
const formSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  companyName: z.string().min(1, 'Company name is required'),
  phoneContact: z.string().min(1, 'Phone number is required')
})

type FormValues = z.infer<typeof formSchema>

interface CompanyUpdateProps {
  companyId: string
  onSuccess: () => void
}

export function CompanyUpdate({ companyId, onSuccess }: CompanyUpdateProps) {
  const { data: company, isLoading } = useGetCompanyDetail(companyId)
  const updateCompanyMutation = useUpdateCompany(companyId)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: company?.data?.companyId || '',
      companyName: company?.data?.companyName || '',
      phoneContact: company?.data?.phoneContact || ''
    }
  })

  const onSubmit = React.useCallback(async (data: FormValues) => {
    if (isSubmitting || updateCompanyMutation.isPending) return
    setIsSubmitting(true)
    try {
      const command = new UpdateCompanyCommand({
        companyId: data.companyId,
        companyName: data.companyName,
        phone: data.phoneContact
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

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || updateCompanyMutation.isPending || !form.formState.isValid}
          >
            {updateCompanyMutation.isPending ? 'Updating...' : 'Update Company'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
