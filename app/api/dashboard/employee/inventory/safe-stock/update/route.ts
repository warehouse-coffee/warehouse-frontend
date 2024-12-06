import { NextResponse, NextRequest } from 'next/server'

import { ApiClientService } from '@/lib/api-service'
import { cookieStore, tokenUtils } from '@/lib/auth'

import { InventoriesClient, UpdateSafeStockCommand } from '../../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formattedForm = await request.json()

    const updateSafeStockCommand = new UpdateSafeStockCommand({
      inventoryId: formattedForm.inventoryId,
      safeStock: formattedForm.safeStock
    })

    const antiforgeryData = await ApiClientService.getAntiforgeryData(token)

    const client = new InventoriesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token,
      antiforgeryData.cookie
    )

    const result = await client.updateSafeStock(updateSafeStockCommand)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}