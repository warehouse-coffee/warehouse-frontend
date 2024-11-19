import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { CreateEmployeeCommand, EmployeesClient, SwaggerException } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const createEmployeeData = await request.json()
    const createEmployeeCommand = new CreateEmployeeCommand({ ...createEmployeeData })
    const client = new EmployeesClient(process.env.NEXT_PUBLIC_BACKEND_API_URL!, undefined, token)
    const result = await client.createEmployee(createEmployeeCommand)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json({ error: error.message, details: error.result }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}