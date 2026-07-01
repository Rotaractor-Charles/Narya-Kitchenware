import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { tag, secret } = body as { tag?: string; secret?: string }

  if (!process.env.NEXTJS_REVALIDATION_SECRET || secret !== process.env.NEXTJS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tags = tag ? [tag, 'menus'] : ['menus']
  for (const t of [...new Set(tags)]) {
    revalidateTag(t)
  }

  return NextResponse.json({ revalidated: true, tags })
}
