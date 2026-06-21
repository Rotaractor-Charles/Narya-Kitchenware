import { NextRequest, NextResponse } from 'next/server'

const PROTECTED: string[] = []
const ADMIN     = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(process.env.SESSION_COOKIE_NAME ?? 'narya_session')

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAdmin     = ADMIN.some((p) => pathname.startsWith(p))

  if ((isProtected || isAdmin) && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
}
