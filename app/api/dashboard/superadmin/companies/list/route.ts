import { NextRequest, NextResponse } from 'next/server'

import { CompaniesClient } from '@/app/api/web-api-client'
import { getServerCookie } from '@/lib/server-auth'

export async function GET(request: NextRequest) {
  const token = getServerCookie('auth_token')
  const xsrfToken = getServerCookie('XSRF-TOKEN')

  try {
    const client = new CompaniesClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const result = await client.getCompanyList()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}