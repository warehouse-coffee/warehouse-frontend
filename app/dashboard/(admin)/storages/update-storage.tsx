'use client'

import { Trash2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { AreaDto2, StorageDto2, UpdateStorageCommand } from '@/app/api/web-api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useUpdateStorage } from '@/hooks/storage'
export function UpdateStorage({ storage }: { storage?: StorageDto2 }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('Active')
  const [areas, setAreas] = useState<AreaDto2[]>([])
  const [newArea, setNewArea] = useState('')
  const updateStorage = useUpdateStorage(() => {

  })
  useEffect(() => {
    if (storage) {
      setName(storage.name || '')
      setAddress(storage.address || '')
      setStatus(storage.status || 'Active')
      setAreas(storage.areas || [])
    }
  }, [storage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedStorage = new UpdateStorageCommand()
    updatedStorage.storageId = storage?.id || 0
    updatedStorage.name = name
    updatedStorage.location = address
    updatedStorage.status = status
    // updatedStorage.areas = areas
    updateStorage.mutate(updatedStorage)
  }

  const addArea = () => {
    if (newArea.trim()) {
      setAreas([...areas, { name: newArea.trim() } as AreaDto2])
      setNewArea('')
    }
  }

  const removeArea = (index: number) => {
    setAreas(areas.filter((_, i) => i !== index))
  }

  if (!storage) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Storage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Areas</Label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area, index) => (
                <div key={index} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1">
                  <span>{area.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => removeArea(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add new area"
              />
              <Button type="button" onClick={addArea}>Add Area</Button>
            </div>
          </div>
          <Button type="submit" className="w-full">Update Storage</Button>
        </form>
      </CardContent>
    </Card>
  )
}