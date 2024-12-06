'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Package } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { UpdateSafeStockCommand } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { safeStockSchema } from '@/configs/zod-schema'
import { useGetSafeStock, useUpdateSafeStock } from '@/hooks/inventory'
import { cn } from '@/lib/utils'

type SafeStockFormValues = z.infer<typeof safeStockSchema>

interface SafeStockFormProps {
  inventoryId: number
  onClose: () => void
}

export default function SafeStockForm({
  inventoryId,
  onClose
}: SafeStockFormProps) {
  const { data, isLoading } = useGetSafeStock(inventoryId)
  const updateSafeStockMutation = useUpdateSafeStock(onClose)

  const form = useForm<SafeStockFormValues>({
    resolver: zodResolver(safeStockSchema),
    defaultValues: {
      safeStock: data || 0
    }
  })

  useEffect(() => {
    if (data) {
      form.setValue('safeStock', data)
    }
  }, [data, form])

  const onSubmit = async (values: SafeStockFormValues) => {
    const formattedForm = {
      inventoryId,
      safeStock: values.safeStock
    } as UpdateSafeStockCommand

    updateSafeStockMutation.mutate(formattedForm)
  }

  const handleResetForm = () => {
    if (data) {
      form.reset({
        safeStock: data
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader size="2rem" />
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="safeStock">
            Safe Stock Level <span className="text-red-500">*</span>
          </Label>
        </div>
        <Input
          id="safeStock"
          type="number"
          placeholder="Enter safe stock level"
          {...form.register('safeStock', { valueAsNumber: true })}
          className={cn(
            form.formState.errors.safeStock && 'border-red-500 focus-visible:ring-red-500'
          )}
        />
        {form.formState.errors.safeStock && (
          <p className="text-sm text-red-500">{form.formState.errors.safeStock.message}</p>
        )}
      </div>

      <DialogFooter className="mt-6">
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
            updateSafeStockMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {updateSafeStockMutation.isPending ? (
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
  )
}