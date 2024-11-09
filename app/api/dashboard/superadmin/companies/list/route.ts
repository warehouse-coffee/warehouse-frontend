import { NextRequest, NextResponse } from 'next/server'

import { cookieStore } from '@/lib/auth'

import { CompaniesClient } from '../../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  try {
    const client = new CompaniesClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const result = await client.getCompanyList()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}