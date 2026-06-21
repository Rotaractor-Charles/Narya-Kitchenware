import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { createSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    // Verify the token is legitimate before issuing a session cookie
    await adminAuth.verifyIdToken(idToken)

    await createSession(idToken)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/auth/login]', err)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
