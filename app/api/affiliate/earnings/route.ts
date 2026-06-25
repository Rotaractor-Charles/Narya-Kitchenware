import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const month = request.nextUrl.searchParams.get('month') ?? ''
  const qs    = month ? `?month=${month}` : ''
  const res   = await fetch(`${API_URL}/api/v1/affiliate/earnings${qs}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    next: { revalidate: 0 },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
