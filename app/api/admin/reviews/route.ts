import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token       = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const qs = searchParams.toString()

  const res  = await fetch(`${API_URL}/api/v1/admin/reviews${qs ? `?${qs}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        'application/json',
    },
    next: { revalidate: 0 },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
