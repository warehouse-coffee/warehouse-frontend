import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

import { IdentityUserClient, SignInCommand } from './web-api-client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = new IdentityUserClient(process.env.NEXT_BACKEND_API_URL)
    const signInCommand = new SignInCommand({ email, password })

    const res = await client.signIn(signInCommand)

    if (res.statusCode === 200 && res.token && typeof res.token === 'string') {
      const userInfo = jwtDecode(res.token)
      console.log('User Info:', userInfo)
      const response = NextResponse.json({ user: userInfo })
      response.cookies.set('token', res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/'
      })
      return response
    } else {
      return NextResponse.json({ error: 'Login failed or invalid credentials', details: res }, { status: res.statusCode || 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error processing login request', details: (error as Error).message }, { status: 500 })
  }
}