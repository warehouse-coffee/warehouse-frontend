import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { EmployeesClient, UpdateEmployeeCommand, SwaggerException } from '../../../../web-api-client'

export async function PUT(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')
  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const updateUserData = await request.json()
    const client = new EmployeesClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)
    const command = new UpdateEmployeeCommand({ ...updateUserData })
    const result = await client.updateEmployee(new UpdateEmployeeCommand(command))
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SwaggerException) {
      return NextResponse.json({ error: error.message, details: error.result }, { status: error.status })
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}