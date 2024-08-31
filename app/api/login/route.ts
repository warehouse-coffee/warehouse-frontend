import { NextResponse } from 'next/server'

import { IdentityUserClient, SignInCommand, SignInVm } from './web-api-client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const client = new IdentityUserClient()
    const signInCommand = new SignInCommand({ email, password })

    const res: SignInVm = await client.signIn(signInCommand)

    if (res.statusCode === 200 && res.token) {
      return NextResponse.json({ token: res.token })
    } else {
      return NextResponse.json({ error: 'Login failed' }, { status: res.statusCode || 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error processing login request' }, { status: 500 })
  }
}