import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { updateAdminCategory, deleteAdminCategory } from '@/lib/categories-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  await updateAdminCategory(id, data)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await deleteAdminCategory(id)
  return NextResponse.json({ success: true })
}
