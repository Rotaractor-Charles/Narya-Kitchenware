import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

async function authHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return null
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }
}

export async function GET() {
  const headers = await authHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
  const res  = await fetch(`${API_URL}/api/v1/affiliate`, { headers, next: { revalidate: 0 } })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST() {
  const headers = await authHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
  const res  = await fetch(`${API_URL}/api/v1/affiliate`, { method: 'POST', headers })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
