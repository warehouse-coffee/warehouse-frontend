import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { StorageClient } from '../../../../web-api-client'

export async function DELETE(request: NextRequest) {
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
    const client = new StorageClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.deleteStorage(Number(id))
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete storage'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}