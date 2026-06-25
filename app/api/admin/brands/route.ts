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

// BrandsManager sends `thumbnail` and `order`; Laravel expects `logo` and `sort_order`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(body: any) {
  const out = { ...body }
  if ('thumbnail' in out) { out.logo = out.thumbnail; delete out.thumbnail }
  if ('order'     in out) { out.sort_order = out.order; delete out.order }
  return out
}

export async function GET() {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const res  = await fetch(`${API_URL}/api/v1/admin/brands`, { headers })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const body = normalise(await request.json())
  const res  = await fetch(`${API_URL}/api/v1/admin/brands`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
