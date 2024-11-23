import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Storage {
  id: number
  name: string
  address: string | null
  status: string
}

interface UpdateStorageProps {
  storage: Storage
  onUpdate: (updatedStorage: Storage) => void
}

export function UpdateStorage({ storage, onUpdate }: UpdateStorageProps) {
  const [name, setName] = useState(storage.name)
  const [address, setAddress] = useState(storage.address || '')
  const [status, setStatus] = useState(storage.status)

  useEffect(() => {
    setName(storage.name)
    setAddress(storage.address || '')
    setStatus(storage.status)
  }, [storage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...storage,
      name,
      address: address || null,
      status
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Button type="submit">Update Storage</Button>
    </form>
  )
}