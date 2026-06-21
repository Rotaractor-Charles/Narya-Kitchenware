import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getProducts, createProduct } from '@/lib/products'

async function assertAdmin() {
  const session = await getSession()
  return !!session
}

export async function GET() {
  if (!await assertAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await assertAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const body    = await request.json()
    const product = await createProduct(body)
    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
