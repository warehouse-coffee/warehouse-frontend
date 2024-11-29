import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { OrdersClient, SaleOrderCommand, SwaggerException } from '../../../../../web-api-client'

export async function POST(req: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    try {
      const createSaleOrderData = await req.json()
      const createSaleOrderCommand = SaleOrderCommand.fromJS({
        customerId: createSaleOrderData.customerId,
        dateExport: createSaleOrderData.dateExport,
        products: createSaleOrderData.products,
        totalPrice: createSaleOrderData.totalPrice
      })

      const client = new OrdersClient(
        process.env.NEXT_PUBLIC_BACKEND_API_URL!,
        undefined,
        token
      )
      const result = await client.saleOrder(createSaleOrderCommand)

      console.log(result)

      if (result.statusCode === 400) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        )
      }

      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof SwaggerException) {
        return NextResponse.json(
          { error: error.message, details: error.result },
          { status: error.status }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error creating sale order' }, { status: 500 })
  }
}