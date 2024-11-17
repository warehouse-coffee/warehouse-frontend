import { NextRequest, NextResponse } from 'next/server'
import { cookieStore, tokenUtils } from '@/lib/auth'
import { EmployeesClient } from '../../../../web-api-client'

export async function DELETE(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userInfo = tokenUtils.getUserInfo(token)

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }

    const client = new EmployeesClient(process.env.NEXT_PUBLIC_BACKEND_API_URL, undefined, token, xsrfToken)

    const result = await client.deleteEmployee(id)
    return NextResponse.json(result)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete employee'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}