import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { createSession } from '@/lib/session'
import { registerSchema } from '@/lib/validations/auth'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { firstName, lastName, email } = parsed.data

    // The client already created the Firebase user and sends us the ID token.
    // We verify it, then create the Firestore profile.
    const { idToken } = body as { idToken: string }
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const uid = decoded.uid

    // Update Firebase Auth display name
    await adminAuth.updateUser(uid, { displayName: `${firstName} ${lastName}` })

    // Create Firestore user document
    await adminDb.collection('users').doc(uid).set({
      uid,
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      tier:        'Cultivator',
      points:      0,
      createdAt:   FieldValue.serverTimestamp(),
      updatedAt:   FieldValue.serverTimestamp(),
    })

    // Create session cookie
    await createSession(idToken)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    console.error('[/api/auth/register]', err)
    const message = err instanceof Error ? err.message : 'Registration failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
