import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'narya_session'
const MAX_AGE_MS  = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 1209600) * 1000

// Exchange a Firebase ID token for a long-lived session cookie.
export async function createSession(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: MAX_AGE_MS })
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   MAX_AGE_MS / 1000,
    path:     '/',
  })
}

// Verify the session cookie and return the decoded claims.
// Returns null if the cookie is missing or invalid.
export async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie) return null
  try {
    return await adminAuth.verifySessionCookie(cookie.value, true)
  } catch {
    return null
  }
}

// Revoke the session cookie and clear it from the browser.
export async function destroySession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (cookie) {
    const decoded = await adminAuth.verifySessionCookie(cookie.value).catch(() => null)
    if (decoded) await adminAuth.revokeRefreshTokens(decoded.uid)
  }
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
}
