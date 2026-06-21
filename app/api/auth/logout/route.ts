import { NextRequest, NextResponse } from 'next/server'
import { destroySession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    await destroySession()
    const referer = request.headers.get('referer') ?? ''
    const dest    = referer.includes('/admin') ? '/admin/login' : '/'
    return NextResponse.redirect(new URL(dest, request.url))
  } catch (err) {
    console.error('[/api/auth/logout]', err)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
