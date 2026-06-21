import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getAdminBrands, createAdminBrand } from '@/lib/brands-admin'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const brands = await getAdminBrands()
  return NextResponse.json({ brands })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json()
  const brand = await createAdminBrand(data)
  return NextResponse.json({ brand })
}
