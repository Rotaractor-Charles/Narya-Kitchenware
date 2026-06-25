import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/account', '/checkout', '/rewards', '/affiliate/dashboard']
const ADMIN     = ['/admin']

// Cookie lifetime — set via NEXT_PUBLIC_AFFILIATE_COOKIE_DAYS env var (default 30).
// Update that env var to match the affiliate.cookie_days setting in admin → Affiliates → Program Settings.
const AFFILIATE_COOKIE_DAYS    = parseInt(process.env.NEXT_PUBLIC_AFFILIATE_COOKIE_DAYS ?? '30', 10)
const AFFILIATE_COOKIE_MAX_AGE = 60 * 60 * 24 * AFFILIATE_COOKIE_DAYS

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const session = request.cookies.get('narya_token')

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAdmin     = ADMIN.some((p) => pathname.startsWith(p)) && pathname !== '/admin/login'

  if (!session) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isProtected) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()

  // Affiliate tracking: ?ref=CODE sets a 30-day cookie (last-click, spec §8)
  const ref = searchParams.get('ref')
  if (ref && /^[a-z0-9]{4,32}$/i.test(ref)) {
    response.cookies.set('narya_affiliate_ref', ref, {
      path:     '/',
      maxAge:   AFFILIATE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      httpOnly: false, // BFF reads via cookies() on server, client JS not needed
    })
  }

  return response
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/rewards/:path*',
    '/admin/:path*',
    '/affiliate/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
