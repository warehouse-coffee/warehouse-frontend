'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CreateCompanyCommand } from '@/app/api/web-api-client'
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
import { useCreateCompany } from '@/hooks/company/useCreateCompany'

// Validation schema
const formSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required').min(2, 'Company ID must be at least 2 characters'),
  companyName: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required').min(10, 'Phone number must be at least 10 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address')
})

type FormValues = z.infer<typeof formSchema>

interface CompanyCreateProps {
  onClose: () => void
}

export function CompanyCreate({ onClose }: CompanyCreateProps) {
  const createCompanyMutation = useCreateCompany(onClose)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: '',
      companyName: '',
      phone: '',
      email: ''
    }
  })

  const onSubmit = React.useCallback(async (data: FormValues) => {
    if (isSubmitting || createCompanyMutation.isPending) return

    setIsSubmitting(true)
    try {
      const command = new CreateCompanyCommand({
        companyId: data.companyId,
        companyName: data.companyName,
        phone: data.phone,
        email: data.email
      })
      await createCompanyMutation.mutateAsync(command)
    } catch (error) {
      console.error('Error creating company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [createCompanyMutation, isSubmitting])

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
                <Input placeholder="Enter company ID" required {...field} />
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
          name="phone"
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
          name="email"
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || createCompanyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createCompanyMutation.isPending || !form.formState.isValid}
          >
            {createCompanyMutation.isPending ? 'Creating...' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Form>
  )
}