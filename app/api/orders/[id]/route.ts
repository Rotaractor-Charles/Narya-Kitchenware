import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type Params = { params: Promise<{ id: string }> }

// GET /api/orders/[orderNumber]
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const res = await fetch(`${API_URL}/api/v1/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
