import { NextResponse } from 'next/server'

import { setAuthCookie } from '@/lib/auth'

import { IdentityUserClient, SignInCommand } from '../../web-api-client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = new IdentityUserClient(process.env.NEXT_BACKEND_API_URL)
    const signInCommand = new SignInCommand({ email, password })

    const res = await client.signIn(signInCommand)

    if (res.statusCode === 200 && res.token && typeof res.token === 'string') {
      const response = NextResponse.json({ success: true })
      setAuthCookie(response, res.token)

      return response
    } else {
      return NextResponse.json({ error: 'Login failed or invalid credentials' }, { status: res.statusCode || 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error processing login request' }, { status: 500 })
  }
}