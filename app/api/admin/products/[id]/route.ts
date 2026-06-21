import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { updateProduct, deleteProduct } from '@/lib/products'

async function assertAdmin() {
  const session = await getSession()
  return !!session
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await assertAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body   = await request.json()
    await updateProduct(id, body)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await assertAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const { id } = await params
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
