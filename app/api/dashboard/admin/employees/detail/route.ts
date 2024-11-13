import { NextRequest, NextResponse } from 'next/server'
import { cookieStore, tokenUtils } from '@/lib/auth'
import { EmployeesClient } from '../../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }
    const client = new EmployeesClient(process.env.NEXT_BACKEND_API_URL, undefined, token, undefined)
    const result = await client.getEmployeeDetail(id)
    return NextResponse.json(result)
  } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch employee details' }, { status: 500 })
  }
}