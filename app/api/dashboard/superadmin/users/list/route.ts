import { NextResponse } from 'next/server'

import { SuperAdminClient } from '../../../../web-api-client'

export async function GET(request: Request) {
  try {
    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL)
    const res = await client.getAllUsers()

    return NextResponse.json(res)
  } catch (error) {
    console.error('Error fetching users:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}