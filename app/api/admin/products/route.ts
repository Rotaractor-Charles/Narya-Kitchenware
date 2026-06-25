import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

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

export async function GET(request: NextRequest) {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const qs = searchParams.toString()
  const res = await fetch(`${API_URL}/api/v1/admin/products${qs ? `?${qs}` : ''}`, { headers })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const res  = await fetch(`${API_URL}/api/v1/admin/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
