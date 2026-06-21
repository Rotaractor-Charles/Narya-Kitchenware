import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/account', '/checkout', '/rewards']
const ADMIN     = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(process.env.SESSION_COOKIE_NAME ?? 'narya_session')

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/rewards/:path*', '/admin/:path*'],
}
