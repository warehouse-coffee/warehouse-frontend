'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Save } from 'lucide-react'
import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { settingsFormSchema } from '@/configs/zod-schema'
import { useCreateSetting } from '@/hooks/setting/useCreateSetting'
import { useGetSetting } from '@/hooks/setting/useGetSetting'
import { cn } from '@/lib/utils'
import { Settings } from '@/types'

export default function SettingsForm() {
  const [showAiKey, setShowAiKey] = useState(false)
  const { data: currentConfig } = useGetSetting()
  const createConfigMutation = useCreateSetting()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Settings>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      aiServiceKey: currentConfig?.aiServiceKey || '',
      emailServiceKey: currentConfig?.emailServiceKey || '',
      aiDriverServer: currentConfig?.aiDriverServer || ''
    }
  })

  const onSubmit = useCallback((data: Settings) => {
    createConfigMutation.mutate(data)
  }, [createConfigMutation])

  const handleResetForm = useCallback(() => {
    if (currentConfig) {
      reset(currentConfig)
      toast.success('Form reset to saved settings')
    }
  }, [currentConfig, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="mb-[.3rem]">API Keys</CardTitle>
            <CardDescription>Manage your service API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-5">
              <div>
                <Label htmlFor="aiServiceKey">AI Service Key</Label>
                <div className="relative mt-[.5rem]">
                  <Input
                    id="aiServiceKey"
                    type={showAiKey ? 'text' : 'password'}
                    placeholder="Enter your AI service key"
                    className="pr-10"
                    autoComplete="off"
                    {...register('aiServiceKey')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAiKey(!showAiKey)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm leading-5"
                  >
                    {showAiKey ? <EyeOff className="h-4 w-4 text-[#fff]" /> : <Eye className="h-4 w-4 text-[#fff]" />}
                  </button>
                </div>
                {errors.aiServiceKey && (
                  <p className="text-red-500 text-sm mt-1">{errors.aiServiceKey.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emailServiceKey">Email Service Key</Label>
                <Input
                  id="emailServiceKey"
                  type="text"
                  placeholder="Enter your email service key"
                  className="mt-[.5rem]"
                  autoComplete="off"
                  {...register('emailServiceKey')}
                />
                {errors.emailServiceKey && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailServiceKey.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="mb-[.3rem]">Server Configuration</CardTitle>
            <CardDescription>Configure your server settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Label htmlFor="aiDriverServer">AI Driver Server</Label>
              <Input
                id="aiDriverServer"
                type="url"
                placeholder="Enter your server URL"
                className="mt-[.5rem]"
                autoComplete="off"
                {...register('aiDriverServer')}
              />
              {errors.aiDriverServer && (
                <p className="text-red-500 text-sm mt-1">{errors.aiDriverServer.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className={cn('bg-accent')}
            onClick={handleResetForm}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className={cn(
              'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
              createConfigMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
            )}
          >
            {createConfigMutation.isPending ? (
              <>
                Creating...
                <Loader color="#62c5ff" size="1.25rem" />
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Config
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}