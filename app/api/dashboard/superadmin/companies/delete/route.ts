import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { CompaniesClient } from '../../../../web-api-client'

export async function DELETE(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    const client = new CompaniesClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.deleteCompany(companyId)
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete company'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}