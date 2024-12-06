import { NextRequest, NextResponse } from 'next/server'

import { EmployeesClient } from '@/app/api/web-api-client'
import { cookieStore } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const token = cookieStore.get('auth_token')

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const client = new EmployeesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL,
      undefined,
      token,
      undefined
    )

    const response = await client.activateEmployee(data.id, data.active)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: 'Error updating employee status',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}