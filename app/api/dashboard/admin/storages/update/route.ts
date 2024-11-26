import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { StorageClient, UpdateStorageCommand } from '../../../../web-api-client'

export async function UPDATE(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Storage ID is required' }, { status: 400 })
    }
    const data = await request.json()
    const command = new UpdateStorageCommand()
    command.storageId = Number(id)
    command.name = data.name
    command.location = data.address
    command.status = data.status
    command.areas = data.areas
    const client = new StorageClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.updateStorage(command)
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to update storage'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}