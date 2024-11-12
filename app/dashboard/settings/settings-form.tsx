'use client'

import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsForm() {
  return (
    <form>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="mb-[.3rem]">API Keys</CardTitle>
            <CardDescription>Manage your service API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-5">
              <div>
                <Label className="text-sm font-medium" htmlFor="ai-key">
                AI Service Key
                </Label>
                <Input
                  id="ai-key"
                  type="text"
                  placeholder="Enter your AI service key"
                  className="mt-[.5rem]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium" htmlFor="email-key">
                Email Service Key
                </Label>
                <Input
                  id="email-key"
                  placeholder="Enter your email service key"
                  className="mt-[.5rem]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="mb-[.3rem]" >Server Configuration</CardTitle>
            <CardDescription>Configure your server settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-sm font-medium" htmlFor="server-url">
              AI Driver Server
              </Label>
              <Input
                id="server-url"
                type="email"
                autoComplete="off"
                placeholder="Enter your server URL"
                className="mt-[.5rem]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary">
            <Save className="mr-2 h-4 w-4" />
          Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}