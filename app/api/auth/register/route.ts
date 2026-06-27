import { NextRequest, NextResponse } from 'next/server'
import { serverRegister } from '@/lib/api/auth'
import { ApiError } from '@/lib/api'
import { setTokenCookie } from '@/lib/api/cookie'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, password_confirmation } = await request.json()
    const { user, token } = await serverRegister(name, email, password, password_confirmation)

    const response = NextResponse.json({ user }, { status: 201 })
    setTokenCookie(response, token)
    return response
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.data, { status: err.status })
    }
    return NextResponse.json(
      { message: 'The Narya API is not reachable. Start the API server and try again.' },
      { status: 503 },
    )
  }
}
