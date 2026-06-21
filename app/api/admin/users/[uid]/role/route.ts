import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getSession } from '@/lib/session'

const VALID_ROLES = ['superadmin', 'admin', 'editor', 'customer']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role } = await request.json()
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const { uid } = await params
  await adminAuth.setCustomUserClaims(uid, { role })
  // Revoke refresh tokens so existing sessions pick up the new claim on next sign-in
  await adminAuth.revokeRefreshTokens(uid)

  return NextResponse.json({ success: true })
}
