import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

async function laravelHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token       = cookieStore.get('narya_token')?.value
  const cartSession = cookieStore.get('narya_cart')?.value

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token       ? { Authorization: `Bearer ${token}` }          : {}),
    ...(!token && cartSession ? { 'X-Cart-Session': cartSession }    : {}),
  }
}

type Params = { params: Promise<{ id: string }> }

// PATCH /api/cart/items/[id] — update quantity
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id }  = await params
  const body    = await request.json()
  const headers = await laravelHeaders()

  const res = await fetch(`${API_URL}/api/v1/cart/${id}`, {
    method:  'PATCH',
    headers,
    body:    JSON.stringify(body),
  })

  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

// DELETE /api/cart/items/[id] — remove item
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id }  = await params
  const headers = await laravelHeaders()

  const res = await fetch(`${API_URL}/api/v1/cart/${id}`, {
    method: 'DELETE',
    headers,
  })

  return new NextResponse(null, { status: res.status })
}
