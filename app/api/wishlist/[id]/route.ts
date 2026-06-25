import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const { id } = await params
  const res    = await fetch(`${API_URL}/api/v1/wishlist/${id}`, {
    method:  'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })

  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
