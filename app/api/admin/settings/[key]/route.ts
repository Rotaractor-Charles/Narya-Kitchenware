import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type Params = { params: Promise<{ key: string }> }

async function adminHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return null
  return {
    Authorization:  `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const { key } = await params
  const body    = await request.json()

  const res  = await fetch(`${API_URL}/api/v1/admin/settings/${encodeURIComponent(key)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
