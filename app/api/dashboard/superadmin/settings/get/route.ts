import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { ConfigurationsClient } from '../../../../web-api-client'

export async function GET(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = new ConfigurationsClient(
      process.env.NEXT_PUBLIC_WEB_API_URL!,
      undefined,
      token,
      xsrfToken
    )
    console.log(client)
    const result = await client.getAllConfig()
    // console.log(result)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}