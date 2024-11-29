'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { importOrderSchema, saleOrderSchema } from '@/configs/zod-schema'
import { useGetCustomerList } from '@/hooks/customer'
import { useCreateSaleOrder } from '@/hooks/order'
import { cn } from '@/lib/utils'

type ImportOrderFormValues = z.infer<typeof importOrderSchema>
type SaleOrderFormValues = z.infer<typeof saleOrderSchema>

interface AddOrderFormProps {
  onClose: () => void
  type: 'import' | 'sale'
}

const ImportOrderForm = ({ onClose }: { onClose: () => void }) => {
  const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({})

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

  const onSubmit = (data: ImportOrderFormValues) => {
    const totalPrice = data.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)

    const finalData = {
      ...data,
      totalPrice,
      type: 'import'
    }

    console.log(finalData)
    onClose()
  }

  const getDateRange = (fieldId: string, index: number) => {
    return dateRanges[fieldId] || form.getValues(`products.${index}.expiration`)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-h-[80vh] px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
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
          <Label htmlFor="customerPhoneNumber">Phone Number</Label>
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
                    <Label>Name</Label>
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
                    <Label>Unit</Label>
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
                    <Label>Quantity</Label>
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
                    <Label>Price</Label>
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
                    <Label>Expiration Date Range</Label>
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
                            return dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                                  {format(dateRange.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(dateRange.from, 'LLL dd, y')
                              )
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
                          defaultMonth={getDateRange(field.id, index)?.from || new Date()}
                          selected={getDateRange(field.id, index)}
                          onSelect={(value) => {
                            setDateRanges(prev => ({
                              ...prev,
                              [field.id]: value
                            }))

                            if (value?.from && value?.to) {
                              form.setValue(`products.${index}.expiration`, {
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
                    {form.formState.errors.products?.[index]?.expiration && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products[index]?.expiration?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Note</Label>
                    <Textarea
                      {...form.register(`products.${index}.note`)}
                      placeholder="Enter note"
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.categoryId`, Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Category 1</SelectItem>
                        <SelectItem value="2">Category 2</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.categoryId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.categoryId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Area</Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.areaId`, Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Area 1</SelectItem>
                        <SelectItem value="2">Area 2</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.products?.[index]?.areaId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.areaId?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Storage</Label>
                    <Select
                      onValueChange={(value) => form.setValue(`products.${index}.storageId`, Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select storage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Storage 1</SelectItem>
                        <SelectItem value="2">Storage 2</SelectItem>
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
          type="submit"
        >
          Add Import Order
        </Button>
      </DialogFooter>
    </form>
  )
}

const SaleOrderForm = ({ onClose }: { onClose: () => void }) => {
  const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({})
  const { data: customers } = useGetCustomerList()
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
          <Label>Customer</Label>
          <Select
            onValueChange={(value) => form.setValue('customerId', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer: { id: number; name: string }) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.customerId && (
            <p className="text-sm text-red-500">{form.formState.errors.customerId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date Exported</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateExported && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateExported ? (
                  format(dateExported, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateExported}
                onSelect={(date) => date && form.setValue('dateExported', date)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
                    <Label>Name</Label>
                    <Input
                      {...form.register(`products.${index}.productName`)}
                      placeholder="Enter product name"
                    />
                    {form.formState.errors.products?.[index]?.productName && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.products?.[index]?.productName?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
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
                    <Label>Price</Label>
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
                    <Label>Expected Pickup Date Range</Label>
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
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
              <Loader color="#62c5ff" size="1.25rem" />
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