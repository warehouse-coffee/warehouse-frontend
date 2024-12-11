'use client'

import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground max-w-[500px]">
            {error.message || 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={() => reset()}
          variant="default"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}