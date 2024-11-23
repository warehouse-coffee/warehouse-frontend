import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Save, XCircle, MapPin, Tag, Info, Check, GripVertical } from 'lucide-react'
import React, { useState, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useCreateStorage } from '@/hooks/storage'

import { CreateStorageCommand, AreaDto } from '../../../../app/api/web-api-client'
export default function StoragesCreatePage({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('0')
  const [areas, setAreas] = useState<string[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const createUserMutation = useCreateStorage(onClose)
  const handleAddArea = () => {
    setAreas([...areas, ''])
  }
  const handleRemoveArea = (index: number) => {
    const newAreas = areas.filter((_, i) => i !== index)
    setAreas(newAreas)
  }
  const handleAreaChange = (index: number, value: string) => {
    const newAreas = [...areas]
    newAreas[index] = value
    setAreas(newAreas)
  }
  const handleDragStart = (index: number) => {
    dragItem.current = index
  }
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newAreas = [...areas]
      const draggedItem = newAreas[dragItem.current]
      newAreas.splice(dragItem.current, 1)
      newAreas.splice(dragOverItem.current, 0, draggedItem)
      setAreas(newAreas)
    }
    dragItem.current = null
    dragOverItem.current = null
  }
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (name.length > 50) newErrors.name = 'Name must be 50 characters or less'
    if (!location.trim()) newErrors.location = 'Location is required'
    if (areas.some(area => !area.trim())) newErrors.areas = 'All areas must have a name'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      const areasDto: AreaDto[] = areas.map((area) => new AreaDto({ name: area }))
      const formData = new CreateStorageCommand({
        name,
        location,
        status: parseInt(status),
        areas: areasDto
      })
      console.log('Submitting:', formData)
      // Simulating API call
      createUserMutation.mutate(formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitting(false)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
      // toast.success('Storage created successfully')
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Coffee Trung Nguyen K3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                <p className="text-sm text-gray-500 mt-1">{name.length}/50 characters</p>
              </div>
              <div>
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, Anytown, USA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`mt-1 ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div>
                <Label htmlFor="status" className="flex items-center">
                  Status
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set the current operational status of the storage</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Active</SelectItem>
                    <SelectItem value="1">UnderMaintenance</SelectItem>
                    <SelectItem value="2">Inactive</SelectItem>
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
              <ScrollArea className="h-[300px] pr-4">
                {areas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center mt-2"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-move" />
                    <div className="w-full">
                      <Input
                        placeholder={`Area ${index + 1}`}
                        value={area}
                        onChange={(e) => handleAreaChange(index, e.target.value)}
                        className={`${errors.areas ? 'border-red-500' : 'border-gray-300'} flex-grow rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveArea(index)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </ScrollArea>
              {errors.areas && <p className="text-red-500 text-sm mt-1">{errors.areas}</p>}
              <Button type="button" variant="outline" onClick={handleAddArea} className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Area
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => {
            setName('')
            setLocation('')
            setStatus('1')
            setAreas(['Area A', 'Area B', 'Area C'])
            setErrors({})
          }}>
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
              />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save
              </>
            )}
          </Button>
        </div>
      </form>
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-green-500 text-white rounded-full flex items-center justify-center"
              >
                <Check className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold text-center mb-2">Success!</h2>
              <p className="text-gray-600 text-center">Your storage has been created.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}