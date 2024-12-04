import { NextRequest, NextResponse } from 'next/server'

import { cookieStore, tokenUtils } from '@/lib/auth'

import { CategoriesClient, CreateCategoryCommand, SwaggerException } from '../../../web-api-client'

export async function POST(req: NextRequest) {
  const token = cookieStore.get('auth_token')

  if (!token || !tokenUtils.isValid(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    try {
      const { category } = await req.json()
      const createCategoryCommand = CreateCategoryCommand.fromJS({
        category: {
          name: category.name
        }
      })

      const client = new CategoriesClient(
        process.env.NEXT_PUBLIC_BACKEND_API_URL!,
        undefined,
        token
      )
      const result = await client.createCategory(createCategoryCommand)

      if (result.statusCode === 400) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        )
      }

      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof SwaggerException) {
        return NextResponse.json(
          { error: error.message, details: error.result },
          { status: error.status }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 })
  }
}