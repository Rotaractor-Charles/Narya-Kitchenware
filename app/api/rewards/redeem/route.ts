import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const res = await fetch(`${API_URL}/api/v1/rewards/redeem`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({ message: 'Could not redeem points.' }))
  return NextResponse.json(data, { status: res.status })
}
