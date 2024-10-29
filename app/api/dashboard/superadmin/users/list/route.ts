import { NextResponse } from 'next/server'

import { getTokenCookie, isTokenValid } from '@/lib/auth'

import { GetUserListQuery, SuperAdminClient, Page } from '../../../../web-api-client'

export async function GET(request: Request) {
  const token = getTokenCookie('auth_token')
  const xsrfToken = getTokenCookie('XSRF-TOKEN')

  if (!token || !isTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const size = parseInt(searchParams.get('size') || '5')

    const client = new SuperAdminClient(process.env.NEXT_BACKEND_API_URL, undefined, token, xsrfToken)

    const page = new Page({
      pageNumber: pageNumber,
      size: size
    })

    const query = new GetUserListQuery({
      page: page
    })

    // console.log(query)

    const response = await client.getAllUsers(query)
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}