import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetUid } = await request.json()
  if (!targetUid) return NextResponse.json({ error: 'targetUid required' }, { status: 400 })

  const customToken = await adminAuth.createCustomToken(targetUid)
  return NextResponse.json({ customToken })
}
