import { NextRequest, NextResponse } from 'next/server'
import { serverLogin } from '@/lib/api/auth'
import { ApiError } from '@/lib/api'
import { setTokenCookie } from '@/lib/api/cookie'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const { user, token } = await serverLogin(email, password)

    const response = NextResponse.json({ user })
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
