import { NextResponse } from 'next/server'
import { serverLogout } from '@/lib/api/auth'
import { clearTokenCookie } from '@/lib/api/cookie'

export async function POST() {
  try {
    await serverLogout()
  } catch {
    // If Laravel returns 401 the token is already dead — still clear the cookie
  }

  const response = NextResponse.json({ message: 'Logged out successfully.' })
  clearTokenCookie(response)
  return response
}
