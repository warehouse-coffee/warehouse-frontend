'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface DateTimePicker24hProps {
  date?: Date
  onChange?: (date: Date) => void
}

export function DateTimePicker24h({ date, onChange }: DateTimePicker24hProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      const newDate = new Date(selectedDate)
      if (date) {
        newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
      }
      onChange(newDate)
    }
  }

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'second',
    value: string
  ) => {
    if (date && onChange) {
      const newDate = new Date(date)
      if (type === 'hour') {
        newDate.setHours(parseInt(value))
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value))
      } else if (type === 'second') {
        newDate.setSeconds(parseInt(value))
      }
      onChange(newDate)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'MM/dd/yyyy HH:mm:ss')
          ) : (
            <span>MM/DD/YYYY HH:mm:ss</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'sm:w-full shrink-0 aspect-square',
                      date && date.getHours() === hour && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                    )}
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'sm:w-full shrink-0 aspect-square',
                      date && date.getMinutes() === minute && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                    )}
                    onClick={() => handleTimeChange('minute', minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 60 }, (_, i) => i).map((second) => (
                  <Button
                    key={second}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'sm:w-full shrink-0 aspect-square',
                      date && date.getSeconds() === second && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                    )}
                    onClick={() => handleTimeChange('second', second.toString())}
                  >
                    {second.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}