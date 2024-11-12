import { NextRequest, NextResponse } from 'next/server'

import { ConfigurationsClient } from '../../../../web-api-client'
import { cookieStore, tokenUtils } from '@/lib/auth'

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
    // const result = await client.getConfig()
    // return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}