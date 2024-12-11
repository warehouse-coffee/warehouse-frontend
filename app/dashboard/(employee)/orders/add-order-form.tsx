'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import React, { useState, useCallback } from 'react'
import { DateRange } from 'react-day-picker'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DateTimePicker24h, DateTimeRangePicker24h } from '@/components/ui/date-time-picker'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { importOrderSchema, saleOrderSchema } from '@/configs/zod-schema'
import { useGetCategoryList } from '@/hooks/category'
import { useGetCustomerList } from '@/hooks/customer'
import { useCreateImportOrder, useCreateSaleOrder } from '@/hooks/order'
import { useGetProductOrder } from '@/hooks/product'
import { useGetStorageList } from '@/hooks/storage'
import { cn } from '@/lib/utils'

type ImportOrderFormValues = z.infer<typeof importOrderSchema>
type SaleOrderFormValues = z.infer<typeof saleOrderSchema>

interface AddOrderFormProps {
  onClose: () => void
  type: 'import' | 'sale'
}

const ImportOrderForm = ({ onClose }: { onClose: () => void }) => {
  const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({})
  const { data: categories } = useGetCategoryList()
  const { data: storages } = useGetStorageList()
  const createImportOrderMutation = useCreateImportOrder(onClose)

  const [selectedStorages, setSelectedStorages] = useState<{ [key: string]: number }>({})

  const getAreasForStorage = (storageId: number) => {
    const storage = storages?.find((storage: { id: number; }) => storage.id === storageId)
    return storage?.areas || []
  }

  const form = useForm<ImportOrderFormValues>({
    resolver: zodResolver(importOrderSchema),
    defaultValues: {
      customerName: '',
      customerPhoneNumber: '',
      products: [
        {
          name: '',
          unit: '',
          quantity: 1,
          price: 0,
          note: '',
          expiration: {
            from: new Date(),
            to: addDays(new Date(), 30)
          },
          categoryId: 0,
          areaId: 0,
          storageId: 0
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'products',
    control: form.control
  })

  const handleResetForm = useCallback(() => {
    form.reset()
  }, [])

  const onSubmit = (data: ImportOrderFormValues) => {
    const totalPrice = data.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)

    const formattedData = {
      totalPrice,
      customerName: data.customerName,
      customerPhoneNumber: data.customerPhoneNumber,
      products: data.products.map((product) => ({
        name: product.name,
        unit: product.unit,
        quantity: product.quantity,
        price: product.price,
        note: product.note,
        expiration: new Date(product.expiration.to).toISOString(),
        categoryId: product.categoryId,
        areaId: product.areaId,
        storageId: product.storageId
      }))
    }

    createImportOrderMutation.mutate(formattedData)
  }

  const getDateRange = (fieldId: string, index: number) => {
    return dateRanges[fieldId] || form.getValues(`products.${index}.expiration`)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-h-[80vh] px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
          <Input
            id="customerName"
            {...form.register('customerName')}
            placeholder="Enter customer name"
          />
          {form.formState.errors.customerName && (
            <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhoneNumber">Phone Number <span className="text-red-500">*</span></Label>
          <Input
            id="customerPhoneNumber"
            {...form.register('customerPhoneNumber')}
            placeholder="Enter phone number"
          />
          {form.formState.errors.customerPhoneNumber && (
            <p className="text-sm text-red-500">{form.formState.errors.customerPhoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
          <Label>Products</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newProductId = `${Date.now()}`
              setDateRanges(prev => ({
                ...prev,
                [newProductId]: {
                  from: new Date(),
                  to: addDays(new Date(), 30)
                }
              }))
              append({
                name: '',
                unit: '',
                quantity: 1,
                price: 0,
                note: '',
                expiration: {
                  from: new Date(),
                  to: addDays(new Date(), 30)
                },
                categoryId: 0,
                areaId: 0,
                storageId: 0
              })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {fields.length === 0 ? (
            <div className="text-[.85rem] text-center py-4 text-muted-foreground">
              No products added. Click &quot;Add Product&quot; to start adding products.
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg relative bg-background">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name <span className="text-red-500">*</span></Label>
                    <Input
                      {...form.register(`products.${index}.name`)}
                      placeholder="Enter product name"
                    />
                    {form.formState.errors.products?.[index]?.name && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Unit <span className="text-red-500">*</span></Label>
                    <Input
                      {...form.register(`products.${index}.unit`)}
                      placeholder="Enter unit"
                    />
                    {form.formState.errors.products?.[index]?.unit && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.unit?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      {...form.register(`products.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Enter quantity"
                    />
                    {form.formState.errors.products?.[index]?.quantity && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Price <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      {...form.register(`products.${index}.price`, { valueAsNumber: true })}
                      placeholder="Enter price"
                    />
                    {form.formState.errors.products?.[index]?.price && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Expiration Date Range <span className="text-red-500">*</span></Label>
                    <DateTimeRangePicker24h
                      dateRange={getDateRange(field.id, index)}
                      onChange={(range) => {
                        setDateRanges(prev => ({
                          ...prev,
                          [field.id]: range
                        }))
                        if (range?.from && range?.to) {
                          form.setValue(`products.${index}.expiration`, {
                            from: range.from,
                            to: range.to
                          })
                        }
                      }}
                    />
                    {form.formState.errors.products?.[index]?.expiration && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products[index]?.expiration?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Note (optional)</Label>
                    <Textarea
                      {...form.register(`products.${index}.note`)}
                      placeholder="Enter note"
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.categoryId`, Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {!categories?.length ? (
                            <SelectItem disabled aria-disabled value="None">No categories found</SelectItem>
                          ) : (
                            categories?.map((category: { id: number; name: string }) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.categoryId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.categoryId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Area <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.areaId`, Number(value))}
                      disabled={!selectedStorages[field.id]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {!selectedStorages[field.id] ? (
                            <SelectItem disabled aria-disabled value="None">Please select a storage first</SelectItem>
                          ) : (
                            getAreasForStorage(selectedStorages[field.id]).map((area: { id: number; name: string }) => (
                              <SelectItem key={area.id} value={area.id.toString()}>
                                {area.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.areaId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.areaId?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Storage <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) => {
                        const storageId = Number(value)
                        form.setValue(`products.${index}.storageId`, storageId)
                        form.setValue(`products.${index}.areaId`, 0)
                        setSelectedStorages(prev => ({
                          ...prev,
                          [field.id]: storageId
                        }))
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select storage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {!storages?.length ? (
                            <SelectItem disabled aria-disabled value="None">No storages found</SelectItem>
                          ) : (
                            storages?.map((storage: { id: number; name: string; }) => (
                              <SelectItem key={storage.id} value={storage.id.toString()}>
                                {storage.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.storageId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.storageId?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DialogFooter className="bg-background">
        <Button className={cn('bg-accent')} type="button" variant="outline" onClick={handleResetForm}>
          Reset
        </Button>
        <Button
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            createImportOrderMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
          type="submit"
        >
          {createImportOrderMutation.isPending ? (
            <>
              Creating...
              <Loader size="1.25rem" />
            </>
          ) : (
            'Add Import Order'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

const SaleOrderForm = ({ onClose }: { onClose: () => void }) => {
  const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({})
  const { data: customers } = useGetCustomerList()
  const { data: products } = useGetProductOrder()
  const createSaleOrderMutation = useCreateSaleOrder(onClose)

  const form = useForm<SaleOrderFormValues>({
    resolver: zodResolver(saleOrderSchema),
    defaultValues: {
      customerId: 0,
      dateExported: new Date(),
      products: [
        {
          productName: '',
          quantity: 1,
          price: 0,
          expectedPickupDate: {
            from: new Date(),
            to: addDays(new Date(), 7)
          }
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'products',
    control: form.control
  })

  const handleResetForm = useCallback(() => {
    form.reset()
  }, [])

  const onSubmit = (data: SaleOrderFormValues) => {
    const totalPrice = data.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)

    const formattedData = {
      totalPrice,
      customerId: data.customerId,
      dateExport: new Date(data.dateExported).toISOString(),
      products: data.products.map(product => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        expectedPickupDate: new Date(product.expectedPickupDate.to).toISOString()
      }))
    }

    createSaleOrderMutation.mutate(formattedData)
  }

  const getDateRange = (fieldId: string, index: number): DateRange => {
    return dateRanges[fieldId] || form.getValues(`products.${index}.expectedPickupDate`)
  }

  const dateExported = form.watch('dateExported')

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-h-[80vh] px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer <span className="text-red-500">*</span></Label>
          <Select
            onValueChange={(value) => form.setValue('customerId', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {!customers?.length ? (
                  <SelectItem disabled aria-disabled value="None">No customers found</SelectItem>
                ) : (
                  customers?.map((customer: { id: number; name: string }) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.customerId && (
            <p className="text-sm text-red-500">{form.formState.errors.customerId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date Exported <span className="text-red-500">*</span></Label>
          <DateTimePicker24h
            date={dateExported}
            onChange={(date) => form.setValue('dateExported', date)}
          />
          {form.formState.errors.dateExported && (
            <p className="text-sm text-red-500">{form.formState.errors.dateExported.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
          <Label>Products</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newProductId = `${Date.now()}`
              setDateRanges(prev => ({
                ...prev,
                [newProductId]: {
                  from: new Date(),
                  to: addDays(new Date(), 7)
                }
              }))
              append({
                productName: '',
                quantity: 1,
                price: 0,
                expectedPickupDate: {
                  from: new Date(),
                  to: addDays(new Date(), 7)
                }
              })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {fields.length === 0 ? (
            <div className="text-[.85rem] text-center py-4 text-muted-foreground">
              No products added. Click &quot;Add Product&quot; to start adding products.
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg relative bg-background">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.productName`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {!products?.length ? (
                            <SelectItem disabled aria-disabled value="None">No products found</SelectItem>
                          ) : (
                            products?.map((product: { name: string }) => (
                              <SelectItem key={product.name} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.productName && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.productName?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      {...form.register(`products.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Enter quantity"
                      min={1}
                    />
                    {form.formState.errors.products?.[index]?.quantity && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Price <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      {...form.register(`products.${index}.price`, { valueAsNumber: true })}
                      placeholder="Enter price"
                      min={0}
                    />
                    {form.formState.errors.products?.[index]?.price && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Pickup Date Range <span className="text-red-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !getDateRange(field.id, index) && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {(() => {
                            const dateRange = getDateRange(field.id, index)
                            return dateRange.from ? (
                              <>
                                {dateRange.from ? format(dateRange.from, 'LLL dd, y') : ''} -{' '}
                                {dateRange.to ? format(dateRange.to, 'LLL dd, y') : ''}
                              </>
                            ) : (
                              <span>Pick a date range</span>
                            )
                          })()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={getDateRange(field.id, index).from}
                          selected={{
                            from: getDateRange(field.id, index).from,
                            to: getDateRange(field.id, index).to
                          }}
                          onSelect={(value) => {
                            if (value?.from && value?.to) {
                              setDateRanges(prev => ({
                                ...prev,
                                [field.id]: {
                                  from: value.from,
                                  to: value.to
                                }
                              }))

                              form.setValue(`products.${index}.expectedPickupDate`, {
                                from: value.from,
                                to: value.to
                              })
                            }
                          }}
                          numberOfMonths={2}
                          className="rounded-md border"
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.products?.[index]?.expectedPickupDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.expectedPickupDate?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DialogFooter className="bg-background">
        <Button className={cn('bg-accent')} type="button" variant="outline" onClick={handleResetForm}>
          Reset
        </Button>
        <Button
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            createSaleOrderMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
          type="submit"
        >
          {createSaleOrderMutation.isPending ? (
            <>
              Creating...
              <Loader size="1.25rem" />
            </>
          ) : (
            'Add Sale Order'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AddOrderForm({ onClose, type }: AddOrderFormProps) {
  return (
    type === 'import' ? <ImportOrderForm onClose={onClose} /> : <SaleOrderForm onClose={onClose} />
  )
}