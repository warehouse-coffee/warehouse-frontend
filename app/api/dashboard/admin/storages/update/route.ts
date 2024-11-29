import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { AreaDto2, StorageClient, UpdateStorageCommand } from '../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const data = await request.json()
    const mappedAreas = data.areas?.map((area: any) => new AreaDto2({ id: 0, name: area.name })) || []
    const command = new UpdateStorageCommand({
      storageId: Number(data.storageId),
      name: data.name,
      location: data.location,
      status: data.status,
      areas: mappedAreas
    })
    const client = new StorageClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.updateStorage(command)
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to update storage'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}