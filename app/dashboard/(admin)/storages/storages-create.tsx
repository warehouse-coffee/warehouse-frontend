import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Plus, X } from 'lucide-react'
import React, { useState, useCallback, useRef } from 'react'

import { CreateStorageCommand, AreaDto } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCreateStorage } from '@/hooks/storage'
import { cn } from '@/lib/utils'

interface StoragesCreatePageProps {
  onClose: () => void
}

const initialFormState = {
  name: '',
  location: '',
  status: '0',
  areas: ['']
}

export default function StoragesCreatePage({ onClose }: StoragesCreatePageProps) {
  const [formData, setFormData] = useState(initialFormState)
  const createStorageMutation = useCreateStorage(onClose)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleStatusChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, status: value }))
  }, [])

  const handleAreaChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newAreas = [...prev.areas]
      newAreas[index] = value
      return { ...prev, areas: newAreas }
    })
  }, [])

  const handleAddArea = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      areas: [...prev.areas, '']
    }))
  }, [])

  const handleRemoveArea = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index)
    }))
  }, [])

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      setFormData(prev => {
        const newAreas = [...prev.areas]
        const draggedItem = newAreas[dragItem.current!]
        newAreas.splice(dragItem.current!, 1)
        newAreas.splice(dragOverItem.current!, 0, draggedItem)
        return { ...prev, areas: newAreas }
      })
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleResetForm = useCallback(() => {
    setFormData(initialFormState)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const areasDto = formData.areas
      .filter(area => area.trim() !== '')
      .map(area => new AreaDto({ name: area }))

    const createData = new CreateStorageCommand({
      name: formData.name,
      location: formData.location,
      status: parseInt(formData.status),
      areas: areasDto
    })

    createStorageMutation.mutate(createData)
  }, [formData, createStorageMutation])

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id="name"
                name="name"
                placeholder="e.g., Coffee Trung Nguyen K3"
                maxLength={50}
                value={formData.name}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                {formData.name.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id="location"
                name="location"
                placeholder="e.g., 123 Main St, Anytown"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="transition-all duration-250 focus:ring-2 focus:ring-accent/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">Active</SelectItem>
                    <SelectItem value="1">Under Maintenance</SelectItem>
                    <SelectItem value="2">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <AnimatePresence mode="popLayout">
                {formData.areas.map((area, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="mb-2"
                  >
                    <div
                      className="flex items-center gap-2 group rounded-md border bg-background hover:border-accent transition-all duration-250"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center px-2 py-1 cursor-move group-hover:opacity-100">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <Input
                          required
                          placeholder={`Area ${index + 1}`}
                          value={area}
                          onChange={(e) => handleAreaChange(index, e.target.value)}
                          className="w-full border-0 focus:ring-2 focus:ring-accent/30 bg-transparent"
                        />
                      </div>
                      {formData.areas.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveArea(index)}
                          className="opacity-0 group-hover:opacity-100 hover:bg-accent transition-all duration-250"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 border-dashed hover:border-accent transition-all duration-250"
              onClick={handleAddArea}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button>
          </CardContent>
        </Card>
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
            createStorageMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {createStorageMutation.isPending ? (
            <>
              Creating...
              <Loader color="#62c5ff" size="1.25rem" />
            </>
          ) : (
            'Create Storage'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}