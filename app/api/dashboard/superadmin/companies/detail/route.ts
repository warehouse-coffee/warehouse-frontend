import { NextRequest, NextResponse } from 'next/server'

import { CompaniesClient } from '@/app/api/web-api-client'
import { cookieStore } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authentication token
    const token = cookieStore.get('auth_token')

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Khởi tạo CompaniesClient với token
    const client = new CompaniesClient(
      process.env.NEXT_PUBLIC_API_URL,
      undefined,
      token,
      undefined
    )

    const company = await client.getCompanyDetail(params.id)

    return NextResponse.json(company, { status: 200 })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: 'Error fetching company details',
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
