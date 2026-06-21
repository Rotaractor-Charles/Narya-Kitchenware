import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { updateAdminBrand, deleteAdminBrand } from '@/lib/brands-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await request.json()
  await updateAdminBrand(id, data)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteAdminBrand(id)
  return NextResponse.json({ success: true })
}
