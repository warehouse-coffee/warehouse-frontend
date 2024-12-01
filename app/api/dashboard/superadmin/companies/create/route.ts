import { NextRequest, NextResponse } from 'next/server'

import { CompaniesClient, CreateCompanyCommand } from '@/app/api/web-api-client'
import { cookieStore } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get authentication token
    const token = cookieStore.get('auth_token')

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Lấy dữ liệu từ request body
    const data = await request.json()

    // Khởi tạo CompaniesClient với token
    const client = new CompaniesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL,
      undefined,
      token,
      undefined
    )

    //create command
    const command = new CreateCompanyCommand({
      companyId: data.companyId,
      companyName: data.companyName,
      phone: data.phone,
      email: data.email
    })

    const response = await client.createCompany(command)

    // Trả về kết quả
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: 'Error creating company',
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
