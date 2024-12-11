import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { AreaDto2, StorageDto2, UpdateStorageCommand } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useUpdateStorage } from '@/hooks/storage'
import { cn } from '@/lib/utils'

interface UpdateStorageProps {
  storage?: StorageDto2
  onSuccess?: () => void
  onClose: () => void
}

export default function UpdateStorage({ storage, onSuccess, onClose }: UpdateStorageProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'Active',
    areas: [] as AreaDto2[],
    newArea: ''
  })

  const updateStorageMutation = useUpdateStorage(() => {
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  })

  useEffect(() => {
    if (storage) {
      setFormData({
        name: storage.name || '',
        location: storage.address || '',
        status: storage.status || 'Active',
        areas: storage.areas || [],
        newArea: ''
      })
    }
  }, [storage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedStorage = new UpdateStorageCommand({
      storageId: storage?.id || 0,
      name: formData.name,
      location: formData.location,
      status: formData.status,
      areas: formData.areas.map(area => new AreaDto2({ name: area.name }))
    })
    updateStorageMutation.mutate(updatedStorage)
  }

  const addArea = () => {
    if (formData.newArea.trim()) {
      const area = new AreaDto2()
      area.name = formData.newArea.trim()
      area.id = 0
      setFormData(prev => ({
        ...prev,
        areas: [...prev.areas, area],
        newArea: ''
      }))
    }
  }

  const removeArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index)
    }))
  }

  const handleReset = () => {
    if (storage) {
      setFormData({
        name: storage.name || '',
        location: storage.address || '',
        status: storage.status || 'Active',
        areas: storage.areas || [],
        newArea: ''
      })
    }
  }

  if (!storage) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="UnderMaintenance">Under Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            Areas <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1.5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {formData.areas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center justify-center bg-accent rounded-md px-2 py-1 text-sm"
                  >
                    {area.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArea(index)}
                      className="h-[1rem] w-[1rem] p-0 cursor-pointer ml-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                    >
                      <X className="h-[.65rem] w-[.65rem]" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              <Input
                value={formData.newArea}
                onChange={(e) => setFormData(prev => ({ ...prev, newArea: e.target.value }))}
                placeholder="Add new area"
                className="flex-1 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addArea()
                  }
                }}
              />
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  onClick={addArea}
                  className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary transition-all duration-200"
                >
                  Add Area
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          className={cn('bg-accent')}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className={cn(
            'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
            updateStorageMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
          )}
        >
          {updateStorageMutation.isPending ? (
            <>
              Saving...
              <Loader size="1.25rem" />
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}