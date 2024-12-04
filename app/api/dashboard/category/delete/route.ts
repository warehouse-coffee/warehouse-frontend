import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'
import { CategoriesClient } from '../../../web-api-client'

export async function DELETE(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get('id'))

    if (!id) {
      return NextResponse.json({ error: 'Valid category ID is required' }, { status: 400 })
    }

    const client = new CategoriesClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.deleteCategory(id)
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete category'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}