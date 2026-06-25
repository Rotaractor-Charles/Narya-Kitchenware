import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'
const CART_COOKIE = 'narya_cart'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function laravelHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token       = cookieStore.get('narya_token')?.value
  const cartSession = cookieStore.get(CART_COOKIE)?.value

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token       ? { Authorization: `Bearer ${token}` }  : {}),
    ...(!token && cartSession ? { 'X-Cart-Session': cartSession } : {}),
  }
}

function setCartCookie(response: NextResponse, sessionId: string | null): void {
  if (!sessionId) return
  response.cookies.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: CART_COOKIE_MAX_AGE,
    path: '/',
  })
}

// GET /api/cart — fetch current cart
export async function GET() {
  const headers = await laravelHeaders()
  const res     = await fetch(`${API_URL}/api/v1/cart`, { headers })
  const data    = await res.json()

  const response = NextResponse.json(data, { status: res.status })
  setCartCookie(response, data.session_id ?? null)
  return response
}

// POST /api/cart — add item
export async function POST(request: NextRequest) {
  const body    = await request.json()
  const headers = await laravelHeaders()

  const res  = await fetch(`${API_URL}/api/v1/cart`, {
    method:  'POST',
    headers,
    body:    JSON.stringify(body),
  })
  const data = await res.json()

  const response = NextResponse.json(data, { status: res.status })
  setCartCookie(response, data.session_id ?? null)
  return response
}
