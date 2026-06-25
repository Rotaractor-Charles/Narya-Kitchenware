import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api/auth'

export async function GET() {
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
