import { NextResponse } from 'next/server'

import { setAuthCookie, setXSRFCookie } from '@/lib/auth'

import { Client, IdentityUserClient, SignInCommand } from '../../web-api-client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = new IdentityUserClient(process.env.NEXT_BACKEND_API_URL)
    const signInCommand = new SignInCommand({ email, password })

    const res = await client.signIn(signInCommand)

    if (res.statusCode === 200 && res.token && typeof res.token === 'string') {
      setAuthCookie(res.token)
      const xsrfClient = new Client(process.env.NEXT_BACKEND_API_URL, undefined, res.token)
      const xsrfToken = await xsrfClient.getAntiforgeryToken()
      setXSRFCookie(xsrfToken)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Login failed or invalid credentials' }, { status: res.statusCode || 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error processing login request' }, { status: 500 })
  }
}