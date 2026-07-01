import { NextRequest, NextResponse } from 'next/server'
import { getFallbackProducts } from '@/lib/api/catalog-fallback'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const params  = request.nextUrl.searchParams
  const qs      = params.toString()
  const q       = params.get('q') ?? ''
  const perPage = Math.min(parseInt(params.get('per_page') ?? '12', 10), 48)
  const page    = Math.max(parseInt(params.get('page') ?? '1', 10), 1)

  try {
    const res  = await fetch(`${API_URL}/api/v1/search${qs ? `?${qs}` : ''}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    // Backend unreachable — search the local sample catalog so dev works offline
    const fallback = getFallbackProducts({ search: q, per_page: perPage, page })
    return NextResponse.json(
      { ...fallback, meta: { ...fallback.meta, query: q } },
      { status: 200 },
    )
  }
}
