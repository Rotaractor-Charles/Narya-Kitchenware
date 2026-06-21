import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getAdminCategories, createAdminCategory } from '@/lib/categories-admin'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await getAdminCategories()
  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const category = await createAdminCategory(data)
  return NextResponse.json({ category })
}
