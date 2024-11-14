import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { ConfigurationsClient, CreateConfigCommand } from '../../../../web-api-client'

export async function POST(request: NextRequest) {
  const token = cookieStore.get('auth_token')
  const xsrfToken = cookieStore.get('XSRF-TOKEN')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settingsData = await request.json()
    const createSettingCommand = CreateConfigCommand.fromJS({ ...settingsData })
    const client = new ConfigurationsClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      token,
      xsrfToken
    )
    const result = await client.createConfig(createSettingCommand)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Create config error:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}