import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const qs  = request.nextUrl.searchParams.toString()
  const res = await fetch(`${API_URL}/api/v1/search${qs ? `?${qs}` : ''}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
