import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { users } = await adminAuth.listUsers(200)

  return NextResponse.json({
    users: users.map(u => ({
      uid:         u.uid,
      email:       u.email ?? '',
      displayName: u.displayName ?? '',
      photoURL:    u.photoURL ?? null,
      role:        (u.customClaims as Record<string, unknown> | undefined)?.role ?? 'customer',
      disabled:    u.disabled,
      lastSignIn:  u.metadata.lastSignInTime ?? null,
    })),
  })
}
