import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value

  const res  = await fetch(`${API_URL}/api/v1/coupons/validate`, {
    method:  'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body:    JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
