import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type Params = { params: Promise<{ slug: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params
  const page      = request.nextUrl.searchParams.get('page') ?? '1'

  const res  = await fetch(`${API_URL}/api/v1/products/${slug}/reviews?page=${page}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest, { params }: Params) {
  const cookieStore = await cookies()
  const token       = cookieStore.get('narya_token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const { slug } = await params
  const body     = await request.json()

  const res  = await fetch(`${API_URL}/api/v1/products/${slug}/reviews`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
