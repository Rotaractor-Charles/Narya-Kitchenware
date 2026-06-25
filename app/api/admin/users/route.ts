import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const res = await fetch(`${API_URL}/api/v1/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        'application/json',
    },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
