import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type Params = { params: Promise<{ id: string; imageId: string }> }

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

  const { id, imageId } = await params
  const body            = await request.json()
  const res             = await fetch(`${API_URL}/api/v1/admin/products/${id}/images/${imageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const headers = await adminHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const { id, imageId } = await params
  const res             = await fetch(`${API_URL}/api/v1/admin/products/${id}/images/${imageId}`, {
    method:  'DELETE',
    headers,
  })

  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
