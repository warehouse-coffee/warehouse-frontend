import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log(body)
    return NextResponse.json({ message: 'Hello, world!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error importing orders' }, { status: 500 })
  }
}